import {Controller, ForbiddenException, Get, Param, ParseIntPipe, Query, Req, Res} from "@nestjs/common";
import {Request, Response} from "express";
import {UserVideoService} from "./service/user-video.service";
import {CommonService} from "../../../common/service/common.service";
import {UserServiceDb} from "../../../db/user/user.service";
import {FriendsService} from "../../friends/service/friends.service";

@Controller()
export class UserVideoController {

    constructor(
        private userVideoService: UserVideoService,
        private commonService: CommonService,
        private userServiceDb: UserServiceDb,
        private friendsService: FriendsService
    ) {}

    @Get(":username")
    async videoUser(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {
        const authUser = await this.commonService.getAuthUserFromRequest(req)

        if(!authUser) {
            const idAvatar = (await this.userServiceDb.findUserByUsername(username)).idAvatar;
            const dataVideo = await this.userVideoService.getVideoIdByUsername(username, 0, 2);
            const countVideo = await this.userVideoService.getCountVideoByUsername(username);

            res.render("modules/video/user-video", {
                video: dataVideo,
                auth: false,
                activeUser: username,
                avatarAnotherUser: idAvatar,
                loadMore: countVideo > 2,
                scripts: ["/js/modules/another-user/another-user-video/another-user-video.js"],
                styles: ["/css/user/another-user.css"]
            });
        } else if(authUser && authUser["username"] === username) {
            const dataVideo = await this.userVideoService.getVideoInfoByUserId(authUser["_id"], 0, 2);
            const countVideo = await this.userVideoService.getCountVideoByIdUser(authUser["_id"]);

            res.render("modules/video/my-video", {
                username: authUser["username"],
                video: dataVideo,
                auth: true,
                idAvatar: authUser["idAvatar"],
                loadMore: countVideo > 2,
                scripts: ["/js/modules/my-account/my-video/my-video.js"],
                styles: ["/css/user/another-user.css"]
            });

            return;
        } else {
            const idAvatar = (await this.userServiceDb.findUserByUsername(username)).idAvatar;
            const dataVideo = await this.userVideoService.getVideoIdByUsername(username, 0, 2);
            const countVideo = await this.userVideoService.getCountVideoByUsername(username);
            const alreadyFriend = await this.friendsService.alreadyFriend(username, authUser["_id"]);

            res.render("modules/video/user-video", {
                username: authUser["username"],
                video: dataVideo,
                auth: true,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                idAvatar: authUser["idAvatar"],
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                loadMore: countVideo > 2,
                scripts: ["/js/modules/another-user/another-user-video/another-user-video.js"],
                styles: ["/css/user/another-user.css"]
            });
        }
    }

    @Get("load-more-video/:skip")
    async loadMoreVideoId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string) {

        if(username) {
            return await this.userVideoService.getVideoIdByUsername(username, skip, 2);
        }
        const authUser = await this.commonService.getAuthUserFromRequest(req);

        if(authUser) {
            return await this.userVideoService.getVideoInfoByUserId(authUser["_id"], skip, 2);
        }
        throw new ForbiddenException();
    }

    @Get("track/:id")
    async getVideo(@Req() req: Request, @Res() res: Response) {
        await this.userVideoService.getVideo(req.params["id"], req, res);
    }
}
