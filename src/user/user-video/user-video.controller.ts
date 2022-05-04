import { Controller, Param, Req, Res, Get, ParseIntPipe, Query } from "@nestjs/common"; 
import { Request, Response } from "express";  
import { UserVideoService } from "./service/user-video.service";

@Controller()
export class UserVideoController {
    
    constructor(private service: UserVideoService) {}

    @Get(":username")
    async videoUser(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {
        const idAvatar = await this.service.getIdAvatar(username);

        if(req["user"] && req["user"].username === username) {
            const dataVideo = await this.service.getVideoIdByUserId(req["user"]._id, 0, 2);
            const countVideo = await this.service.getCountVideoByIdUser(req["user"]._id);

            res.render("my-video", {
                username: req["user"].username,
                video:dataVideo,
                auth: true,
                idAvatar: req["user"].idAvatar,
                avatarAnotherUser: idAvatar,
                loadMore: countVideo > 2 ? true : false,
                script: "/js/modules/my-account/my-video/my-video.js",
                style: "/css/another-user.css"
            });
        
            return;
        }
        if(req["user"] && req["user"].username !== username) {
            const dataVideo = await this.service.getVideoIdByUsername(username, 0, 2);
            const countVideo = await this.service.getCountVideoByUsername(username);
            const alreadyFriend = await this.service.alreadyFriend(username, req["user"]._id);

            res.render("user-video", {
                username: req["user"].username,
                video:dataVideo,
                auth: true,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                idAvatar: req["user"].idAvatar,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                loadMore: countVideo > 2 ? true : false,
                script: "/js/modules/another-user/another-user-video/another-user-video.js",
                style: "/css/another-user.css"
            });

            return;
        }
        const dataVideo = await this.service.getVideoIdByUsername(username, 0, 2);
        const countVideo = await this.service.getCountVideoByUsername(username);

        res.render("user-video", {
            video:dataVideo,
            auth: false,
            activeUser: req.params["username"],
            avatarAnotherUser: idAvatar,
            loadMore: countVideo > 2 ? true : false,
            script: "/js/modules/another-user/another-user-video/another-user-video.js",
            style: "/css/another-user.css"
        });
    }

    @Get("load-more-video/:skip")
    async loadMoreVideoId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string, @Res() res: Response) {
        
        if(!username) {
            const video = await this.service.getVideoIdByUserId(req["user"]._id, skip, 2);

            res.send(video);

            return;
        }
        const video = await this.service.getVideoIdByUsername(username, skip, 2);

        res.send(video);
    }

    @Get("track/:id")
    async getVideo(@Req() req: Request, @Res() res: Response) {
        await this.service.getVideo(req.params["id"], req, res);
    }
}
