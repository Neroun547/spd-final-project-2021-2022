import { Body, Controller, Delete, Get, ParseIntPipe, Post, Req, Res, UploadedFile, Param } from "@nestjs/common";
import { Request, Response } from "express"; 
import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MyPhotoService } from "./service/myPhoto.service";
import { UploadPhotoDto } from "./dto/upload-photo.dto";

@Controller()
export class MyPhotoController {
    constructor(private readonly service:MyPhotoService){}

    @Get()
    async myPhotoPage(@Req() req:Request, @Res() res:Response){
        const photo = await this.service.loadPhoto(req["user"]._id);
        const countPhoto = await this.service.getCountPhoto(req["user"]._id);

        res.render("my-photo", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            photo: photo,
            loadMore: countPhoto > 4 ? true : false,
            script:"/js/my-photo.js",
            style: "/css/my-photo.css"
        });
    }

    @Post("upload-new-photo")
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            if(file.mimetype !== "image/png" && file.mimetype !== "image/jpeg" && file.mimetype !== "image/jpg") {
                cb(null, false);
            }
            if(+file.size > 100000000){
                cb(null, false);
            } else {
                cb(null, true);
            }
        
        },
        storage: diskStorage({
            destination: './photo',
            filename:(req, file, cb) => {
                const name = Date.now();
                return cb(null, `${name+Math.floor(Math.random() * 1000) + "." + file.mimetype.replace("image/", "")}`);
            }
        })
    }))
    async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Body() body: UploadPhotoDto, @Req() req: Request, @Res() res: Response) {
        await this.service.uploadPhoto({
            file: file,
            theme: body.theme.trim(),
            description: body.description.trim(),
            author: req["user"]._id
        });

        res.redirect("/my-photo");
    }

    @Get("upload-new-photo-form")
    uploadNewPhotoForm(@Req() req:Request, @Res() res:Response){
        res.render("upload-photo-form", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css"
        });
    }

    @Get("photo/:id")
    getPhoto(@Req() req:Request, @Res() res:Response){
        this.service.getPhoto(req.params["id"], res);
    }

    @Get("load-more-photo/:skip")
    async loadMorePhoto(@Req() req:Request, @Res() res:Response, @Param("skip", new ParseIntPipe()) skip: number) {
        const photos = await this.service.loadMorePhoto(req["user"]._id, skip);     
        res.send(photos);
    }

    @Delete("delete-photo/:id")
    async deletePhoto(@Req() req:Request, @Res() res:Response) {
        await this.service.deletePhoto(req.params["id"], req["user"]._id);
        res.sendStatus(200);
    }
}
