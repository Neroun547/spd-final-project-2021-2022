import { Body, Controller, Delete, Get, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { MyVideo } from "./service/myVideo.service";
import { v4 as uuidv4 } from 'uuid';
import { UploadVideoDto } from "./dto/uploadVideo.dto";

@Controller()
export class MyVideoController {
    constructor(private readonly myVideoService: MyVideo){};

    @Get()
    async myVideoPage(@Req() req: Request, @Res() res: Response) {
        const video = await this.myVideoService.getVideoId(req["user"]._id, 2, 0);
        const countVideo = await this.myVideoService.getCountVideo(req["user"]._id);
        
        res.render("my-video", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            video: video,
            loadMore: countVideo > 2 ? true : false,
            script: "/js/my-video.js",
            style: "/css/my-video.css"
        });
    }

    @Get("upload-new-video-form")
    async myVideoForm(@Req() req: Request, @Res() res: Response) {
        res.render("upload-video-form", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css",
            script: "/js/upload-video.js"
        });
    }

    @Post("upload-new-video")
    @UseInterceptors(FileInterceptor('file', {
        fileFilter:(req, file, cb) => {
            if(file.mimetype !== "video/mp4") {
                cb(null, false);
            }
            if(+file.size > 10000000){
                cb(null, false);
            } else {
                cb(null, true);
            }
        },
        storage:diskStorage({
            destination: './video',
            filename:(req, file, cb) => {
                const name = Date.now();
                return cb(null, `${name+Math.floor(Math.random() * 1000) + "." + file.originalname}`);
            }
        })
    }))
    async uploadNewVideo(@Body() body: UploadVideoDto, @Req() req: Request, @Res() res: Response) {
        await this.myVideoService.uploadNewVideo({ 
            name: body.name,
            video: req.file.filename,
            publicateUser: req["user"]._id,
            idVideo: uuidv4(),
            description: body.description
        });

        res.redirect("/my-video");
    }

    @Post("load-more")
    async loadMoreVideo(@Req() req: Request) {
        return await this.myVideoService.getVideoId(req["user"]._id, 2, req.body.skip);
    }

    @Delete("delete/:id")
    async deleteVideo(@Req() req: Request, @Res() res: Response) {
        try {
            await this.myVideoService.deleteVideo(req.params["id"], req["user"]._id);
        
            res.sendStatus(200);
        } catch(e) {
            console.log(e);
            res.sendStatus(500);
        }
    }

    @Get("private-video")
    myPrivateVideoPage(@Req() req: Request, @Res() res: Response) {
        res.render("my-private-video", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/my-video.css"
        });
    }

    @Get(":id")
    async getVideo(@Req() req: Request, @Res() res: Response) {
        await this.myVideoService.getVideo(req.params["id"], req, res);
    }
}
