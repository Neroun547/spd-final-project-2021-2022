import {Controller, Param, Req, Res, Get, ParseIntPipe, Query, ForbiddenException} from "@nestjs/common";
import { Request, Response } from "express";  
import { UserVideoService } from "./service/user-video.service";
import {secretJwt} from "../../../config.json";
import {JwtService} from "@nestjs/jwt";

@Controller()
export class UserVideoController {
    
    constructor(
        private service: UserVideoService,
        private jwtService: JwtService
    ) {}

    @Get(":username")
    async videoUser(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {
        const idAvatar = await this.service.getIdAvatar(username);
        let user;

        try {
            user = this.jwtService.verify(req.cookies["token"], {secret: secretJwt});
        } catch {
            const dataVideo = await this.service.getVideoIdByUsername(username, 0, 2);
            const countVideo = await this.service.getCountVideoByUsername(username);

            res.render("user-video", {
                video: dataVideo,
                auth: false,
                activeUser: username,
                avatarAnotherUser: idAvatar,
                loadMore: countVideo > 2 ? true : false,
                script: "/js/modules/another-user/another-user-video/another-user-video.js",
                style: "/css/another-user.css"
            });

            return;
        }

        if(user.username === username) {
            const dataVideo = await this.service.getVideoIdByUserId(user._id, 0, 2);
            const countVideo = await this.service.getCountVideoByIdUser(user._id);

            res.render("my-video", {
                username: user.username,
                video: dataVideo,
                auth: true,
                idAvatar: user.idAvatar,
                avatarAnotherUser: idAvatar,
                loadMore: countVideo > 2 ? true : false,
                script: "/js/modules/my-account/my-video/my-video.js",
                style: "/css/another-user.css"
            });
        
            return;
        }
        if(user.username !== username) {
            const dataVideo = await this.service.getVideoIdByUsername(username, 0, 2);
            const countVideo = await this.service.getCountVideoByUsername(username);
            const alreadyFriend = await this.service.alreadyFriend(username, user._id);

            res.render("user-video", {
                username: user.username,
                video: dataVideo,
                auth: true,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                idAvatar: user.idAvatar,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                loadMore: countVideo > 2 ? true : false,
                script: "/js/modules/another-user/another-user-video/another-user-video.js",
                style: "/css/another-user.css"
            });

            return;
        }
    }

    @Get("load-more-video/:skip")
    async loadMoreVideoId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string) {

        if(username) {
            const video = await this.service.getVideoIdByUsername(username, skip, 2);

            return video;
        }
        try {
            const user = this.jwtService.verify(req.cookies["token"], {secret: secretJwt});

            return await this.service.getVideoIdByUserId(user._id, skip, 2);
        } catch {
            throw new ForbiddenException();
        }
    }

    @Get("track/:id")
    async getVideo(@Req() req: Request, @Res() res: Response) {
        await this.service.getVideo(req.params["id"], req, res);
    }
}
