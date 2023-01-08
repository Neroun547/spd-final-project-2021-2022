import {Body, Controller, Delete, Get, Post, Req, Res, UploadedFile, UseGuards} from "@nestjs/common";
import { Request, Response } from "express";
import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MyMusicService } from "./service/my-music.service";
import { UploadMusicDto } from "./dto/upload-music.dto";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller()
export class MyMusicController {

    constructor(private readonly myMusicsService: MyMusicService){}

    @UseGuards(JwtAuthGuard)
    @Get("upload-new-musics-form")
    uploadNewMusicForm(@Req() req:Request, @Res() res:Response) {
        res.render("upload-musics-form", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            styles: ["/css/signInForm.css"]
        });
    }

    @UseGuards(JwtAuthGuard)
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
            publicateUser: req.user["_id"]
        });

        res.redirect(`/user/music/${req.user["username"]}`);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("delete/:id")
    async deleteMusic(@Req() req: Request, @Res() res: Response) {   
        await this.myMusicsService.deleteMusic(req.params["id"], req.user["_id"]);
        res.sendStatus(200);
    }
}

