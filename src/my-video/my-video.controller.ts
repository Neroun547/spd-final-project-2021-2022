import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    Res, UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { diskStorage } from "multer";
import { MyVideo } from "./service/my-video.service";
import { v4 as uuidv4 } from 'uuid';
import { UploadVideoDto } from "./dto/upload-video.dto";
import {JwtAuthGuard} from "../auth/guard/jwt-auth.guard";

@Controller()
export class MyVideoController {
    constructor(private readonly myVideoService: MyVideo){};

    @UseGuards(JwtAuthGuard)
    @Get("upload-new-video-form")
    async myVideoForm(@Req() req: Request, @Res() res: Response) {
        res.render("modules/video/upload-video-form", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            styles: ["/css/signInForm.css"],
            scripts: ["/js/modules/my-account/my-video/upload-video.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
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
                publicateUser: req.user["_id"],
                idVideo: uuidv4(),
                description: body.description
            });

            res.redirect("/my-video/private-video");

            return;
        }

        await this.myVideoService.uploadNewVideo({ 
            name: body.name,
            video: req.file.filename,
            publicateUser: req.user["_id"],
            idVideo: uuidv4(),
            description: body.description
        });

        res.redirect(`/user/video/${req.user["username"]}`);
    }

    @UseGuards(JwtAuthGuard)
    @Delete("delete/:id")
    async deleteVideo(@Req() req: Request, @Res() res: Response) {

        try {
            if(!req.body.isPrivate) {
                await this.myVideoService.deleteVideo(req.params["id"], req.user["_id"]);
            }
            if(req.body.isPrivate) {
                await this.myVideoService.deletePrivateVideo(req.params["id"], req.user["_id"]);
            }
            res.sendStatus(200);
        } catch(e) {
            res.sendStatus(500);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get("private-video")
    async myPrivateVideoPage(@Req() req: Request, @Res() res: Response) {
        const video = await this.myVideoService.getPrivateVideoId(req.user["_id"], 2, 0);
        const countVideo = await this.myVideoService.getCountPrivateVideo(req.user["_id"]);

        res.render("modules/video/my-private-video", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            styles: ["/css/video/my-video.css"],
            video: video,
            loadMore: countVideo > 2 ? true : false,
            scripts: ["/js/modules/my-account/my-video/my-video.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Put("make-private-video/:id")
    async makePrivateVideo(@Req() req: Request, @Res() res: Response) {
        await this.myVideoService.makePrivateVideo(req.params["id"], req.user["_id"]);

        res.sendStatus(200);
    }

    @UseGuards(JwtAuthGuard)
    @Get("load-more-private/:skip") 
    async loadMorePrivate(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number) {
        return await this.myVideoService.getPrivateVideoId(req.user["_id"], 2, skip);
    }

    @UseGuards(JwtAuthGuard)
    @Put("make-public-video/:id")
    async makePublicVideo(@Req() req: Request, @Res() res: Response) {    
        await this.myVideoService.makePublicVideo(req.params["id"], req.user["_id"]);

        res.sendStatus(200);
    }

    @UseGuards(JwtAuthGuard)
    @Put("change-params-video/:id")
    async changeParamsVideo(@Body() body: UploadVideoDto, @Req() req: Request) {
        await this.myVideoService.changeParamsVideo(req.user["_id"], body.name, body.description, req.params["id"], false);

        return ({ message: "Params was updated success" });
    }

    @UseGuards(JwtAuthGuard)
    @Put("change-params-private-video/:id")
    async changeParamsPrivateVideo(@Body() body: UploadVideoDto, @Req() req: Request) {
        await this.myVideoService.changeParamsVideo(req.user["_id"], body.name, body.description, req.params["id"], true);

        return ({ message: "Params was updated success" });
    }

    @UseGuards(JwtAuthGuard)
    @Get("change-params-video/:id")
    async changeParamsVideoForm(@Req() req: Request, @Res() res: Response) { 
        res.render("modules/video/change-params-video", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            styles: ["/css/signInForm.css"],
            idVideo: req.params["id"],
            scripts: ["/js/modules/my-account/my-video/change-params-video.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get("change-params-private-video/:id")
    async changeParamsPrivateVideoForm(@Req() req: Request, @Res() res: Response) {
        res.render("modules/video/change-params-private-video", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            styles: ["/css/signInForm.css"],
            idVideo: req.params["id"],
            scripts: ["/js/modules/my-account/my-video/change-params-private-video.js"]
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get("/private-video/:id")
    async getPrivateVideo(@Req() req: Request, @Res() res: Response) {
        await this.myVideoService.getPrivateVideo(req.params["id"], req, res);
    }

    @UseGuards(JwtAuthGuard)
    @Get("upload-new-video-from-web-camera")
    uploadNewVideoFromWebCameraPage(@Req() req: Request, @Res() res: Response) {
        res.render("modules/video/upload-new-video-from-web-camera", {
            username: req.user["username"],
            auth: true,
            idAvatar: req.user["idAvatar"],
            scripts: ["/js/modules/my-account/my-video/upload-video-from-web-camera.js"],
            styles: ["/css/video/upload-new-video-from-web-camera.css"]
        });
    }
}
