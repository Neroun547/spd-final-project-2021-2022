import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseInterceptors } from "@nestjs/common";
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
            script: "/js/modules/my-account/my-video/my-video.js",
            style: "/css/my-video.css"
        });
    }

    @Get("upload-new-video-form")
    async myVideoForm(@Req() req: Request, @Res() res: Response) {
        res.render("upload-video-form", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css",
            script: "/js/modules/my-account/my-video/upload-video.js"
        });
    }

    @Post("upload-new-video")
    @UseInterceptors(FileInterceptor("file", {
        fileFilter:(req, file, cb) => {
    
            if(file.mimetype !== "video/mp4") {
                cb(null, false);
                return;
            }
            if(+file.size > 1000000000){
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
    
        if(req.body.isPrivate === "on") {
            await this.myVideoService.uploadNewPrivateVideo({
                name: body.name,
                video: req.file.filename,
                publicateUser: req["user"]._id,
                idVideo: uuidv4(),
                description: body.description
            });

            res.redirect("/my-video/private-video");

            return;
        }

        await this.myVideoService.uploadNewVideo({ 
            name: body.name,
            video: req.file.filename,
            publicateUser: req["user"]._id,
            idVideo: uuidv4(),
            description: body.description
        });

        res.redirect("/my-video");
    }

    @Get("load-more/:skip")
    async loadMoreVideo(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number) {
        return await this.myVideoService.getVideoId(req["user"]._id, 2, skip);
    }

    @Delete("delete/:id")
    async deleteVideo(@Req() req: Request, @Res() res: Response) {

        try {
            if(!req.body.isPrivate) {
                await this.myVideoService.deleteVideo(req.params["id"], req["user"]._id);
            }
            if(req.body.isPrivate) {
                await this.myVideoService.deletePrivateVideo(req.params["id"], req["user"]._id);
            }
            res.sendStatus(200);
        } catch(e) {
            res.sendStatus(500);
        }
    }


    @Get("private-video")
    async myPrivateVideoPage(@Req() req: Request, @Res() res: Response) {
        const video = await this.myVideoService.getPrivateVideoId(req["user"]._id, 2, 0);
        const countVideo = await this.myVideoService.getCountPrivateVideo(req["user"]._id);

        res.render("my-private-video", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/my-video.css",
            video: video,
            loadMore: countVideo > 2 ? true : false,
            script: "/js/modules/my-account/my-video/my-video.js"
        });
    }

    @Put("make-private-video/:id")
    async makePrivateVideo(@Req() req: Request, @Res() res: Response) {
        await this.myVideoService.makePrivateVideo(req.params["id"], req["user"]._id);

        res.sendStatus(200);
    }

    @Get("load-more-private/:skip") 
    async loadMorePrivate(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number) {
        return await this.myVideoService.getPrivateVideoId(req["user"]._id, 2, skip);
    }

    @Put("make-public-video/:id")
    async makePublicVideo(@Req() req: Request, @Res() res: Response) {    
        await this.myVideoService.makePublicVideo(req.params["id"], req["user"]._id);

        res.sendStatus(200);
    }

    @Put("change-params-video/:id")
    async changeParamsVideo(@Body() body: UploadVideoDto, @Req() req: Request, @Res() res: Response) {
        await this.myVideoService.changeParamsVideo(req["user"]._id, body.name, body.description, req.params["id"], false);

        res.send({ message: "Params was updated success" });
    }

    @Put("change-params-private-video/:id")
    async changeParamsPrivateVideo(@Body() body: UploadVideoDto, @Req() req: Request, @Res() res: Response) {
        await this.myVideoService.changeParamsVideo(req["user"]._id, body.name, body.description, req.params["id"], true);

        res.send({ message: "Params was updated success" });
    }

    @Get("change-params-video/:id")
    async changeParamsVideoForm(@Req() req: Request, @Res() res: Response) { 
        res.render("change-params-video", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css",
            idVideo: req.params["id"],
            script: "/js/modules/my-account/my-video/change-params-video.js"
        });
    }

    @Get("change-params-private-video/:id")
    async changeParamsPrivateVideoForm(@Req() req: Request, @Res() res: Response) {
        res.render("change-params-private-video", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css",
            idVideo: req.params["id"],
            script: "/js/modules/my-account/my-video/change-params-private-video.js"
        });
    }

    @Get("/private-video/:id")
    async getPrivateVideo(@Req() req: Request, @Res() res: Response) {
        await this.myVideoService.getPrivateVideo(req.params["id"], req, res);
    }

    @Get(":id")
    async getVideo(@Req() req: Request, @Res() res: Response) {
        await this.myVideoService.getVideo(req.params["id"], req, res);
    }
}
