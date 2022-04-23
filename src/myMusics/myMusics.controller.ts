import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, Res, UploadedFile } from "@nestjs/common";
import { Request, Response } from "express";
import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MyMusicsService } from "./service/myMusics.service";
import { UploadMusicDto } from "./dto/upload-music.dto";  

@Controller()
export class MyMusicsController {

    constructor(private readonly myMusicsService: MyMusicsService){}

    @Get("upload-new-musics-form")
    uploadNewMusicForm(@Req() req:Request, @Res() res:Response) {
        res.render("upload-musics-form", {
            username: req["user"].username,
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css"
        });
    }

    @Post("upload-new-music")
    @UseInterceptors(FileInterceptor('file', {
        fileFilter:(req, file, cb) => {
            if(file.mimetype !== "audio/mpeg") {
                cb(null, false);
                return;
            }
            if(+file.size > 30000000){
                cb(null, false);
            } else {
                cb(null, true);
            }
        },
        storage:diskStorage({
            destination: './musics',
            filename:(req, file, cb) => {
                const name = Date.now();
                return cb(null, `${name+Math.floor(Math.random() * 1000) + "." + file.originalname}`);
            }
        })
    }))
    async uploadMusic(@UploadedFile() file: Express.Multer.File, @Body() body: UploadMusicDto, @Req() req:Request, @Res() res:Response) {
        await this.myMusicsService.uploadNewMusics({ 
            name: body.name,
            author: body.author,
            music: file.filename,
            publicateUser: req["user"]._id 
        });

        res.redirect(`/user/music/${req["user"].username}`);        
    }

    @Delete("delete/:id")
    async deleteMusic(@Req() req: Request, @Res() res: Response) {   
        await this.myMusicsService.deleteMusic(req.params["id"], req["user"]._id);
        res.sendStatus(200);
    }
}

