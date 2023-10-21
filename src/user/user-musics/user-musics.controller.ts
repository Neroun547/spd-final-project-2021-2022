import {Controller, ForbiddenException, Get, Param, ParseIntPipe, Query, Req, Res} from "@nestjs/common";
import { Request, Response } from "express";
import { UserMusicsService } from "./service/user-musics.service";
import {secretJwt} from "../../../config.json";
import {JwtService} from "@nestjs/jwt";
import {CommonService} from "../../../common/service/common.service";
import {UserServiceDb} from "../../../db/user/user.service";
import {FriendsService} from "../../friends/service/friends.service";

@Controller()
export class UserMusicsController {
    constructor(
        private service: UserMusicsService,
        private jwtService: JwtService,
        private commonService: CommonService,
        private userService: UserServiceDb,
        private friendService: FriendsService
    ) { };

    @Get(":username")
    async musicUser(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {
        const dataMusic = await this.service.getMusicIdByUsername(0, 5, username);
        const countMusic = await this.service.getCountMusicByUsername(username);
        const authUser = await this.commonService.getAuthUserFromRequest(req);

        if(!authUser) {
            const idAvatar = (await this.userService.findUserByUsername(username)).idAvatar;

            res.render("modules/music/user-music", {
                music: dataMusic,
                auth: false,
                idAvatar: false,
                activeUser: username,
                avatarAnotherUser: idAvatar,
                loadMoreMusic: countMusic > 5,
                scripts: ["/js/modules/another-user/another-user-music/another-user-music.js"],
                styles: ["/css/user/another-user.css"]
            });
        } else if(authUser && authUser["username"] === username) {
            const dataMusic = await this.service.getMusicIdById(0, 5, authUser["_id"]);
            const countMusic = await this.service.getCountMusicById(authUser["_id"]);

            res.render("modules/music/my-music", {
                username: authUser["username"],
                auth: true,
                idAvatar: authUser["idAvatar"],
                musics: dataMusic,
                loadMore: countMusic > 5,
                countMusic: countMusic,
                scripts: ["/js/modules/my-account/my-music/my-music.js"],
                styles: ["/css/music/my-music.css"]
            });
        } else {
            const idAvatar = (await this.userService.findUserByUsername(username)).idAvatar;
            const alreadyFriend = await this.friendService.alreadyFriend(username, authUser["_id"]);

            res.render("modules/music/user-music", {
                username: authUser["username"],
                music: dataMusic,
                auth: true,
                idAvatar: authUser["idAvatar"],
                activeUser: username,
                avatarAnotherUser: idAvatar,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                loadMoreMusic: countMusic > 5,
                scripts: ["/js/modules/another-user/another-user-music/another-user-music.js"],
                styles: ["/css/user/another-user.css"]
            });
        }
    }
    @Get("load-more-music/:skip")
    async loadMoreMusicId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string) {

        if(username) {
            return await this.service.getMusicIdByUsername(skip, 5, username);
        }
        const authUser = await this.commonService.getAuthUserFromRequest(req);

        if(authUser) {
            return await this.service.getMusicIdById(skip, 5, authUser["_id"]);
        }
        throw new ForbiddenException();
    }
    @Get("audio/:id")
    async getMusic(@Req() req:Request, @Res() res:Response) {
        await this.service.getMusic(req.params["id"], req, res);
    }
}
