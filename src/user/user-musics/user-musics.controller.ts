import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";  
import { UserMusicsService } from "./service/user-musics.service";
import {secretJwt} from "../../../config.json";
import {JwtService} from "@nestjs/jwt";
import {use} from "passport";

@Controller()
export class UserMusicsController {
    constructor(
        private service: UserMusicsService,
        private jwtService: JwtService
    ) { };

    @Get(":username")
    async musicUser(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {
        const dataMusic = await this.service.getMusicIdByUsername(0, 5, username);
        const countMusic = await this.service.getCountMusicByUsername(username);
        const idAvatar = await this.service.getIdAvatar(username);

        if(!req.cookies["token"]) {
            res.render("user-music", {
                music: dataMusic,
                auth: false,
                idAvatar: false,
                activeUser: username,
                avatarAnotherUser: idAvatar,
                loadMoreMusic: countMusic > 5 ? true : false,
                script: "/js/modules/another-user/another-user-music/another-user-music.js",
                style: "/css/another-user.css"
            });

            return;
        }
        const user = this.jwtService.verify(req.cookies["token"], { secret: secretJwt });

        if(user && user["username"] === username) {
            const dataMusic = await this.service.getMusicIdById(0, 5, user["_id"]);
            const countMusic = await this.service.getCountMusicById(user["_id"]);

            res.render("my-musics", {
                username: user["username"],
                auth: true,
                idAvatar: user["idAvatar"],
                musics: dataMusic,
                loadMore: countMusic > 5 ? true : false,
                countMusic: countMusic,
                script:"/js/modules/my-account/my-music/my-music.js",
                style: "/css/my-musics.css"
            });

            return;
        }
        if(user && user["username"] !== username) {
            const alreadyFriend = await this.service.alreadyFriend(username, user["_id"]);

            res.render("user-music", {
                username: user["username"],
                music: dataMusic,
                auth: true,
                idAvatar: user["idAvatar"],
                activeUser: username,
                avatarAnotherUser: idAvatar,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                loadMoreMusic: countMusic > 5 ? true : false,
                script: "/js/modules/another-user/another-user-music/another-user-music.js",
                style: "/css/another-user.css"
            });

            return;
        }
    }
    @Get("load-more-music/:skip")
    async loadMoreMusicId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string) {

        if(!req.cookies["token"] || username) {
            return await this.service.getMusicIdByUsername(skip, 5, username);;
        }
        const user = this.jwtService.verify(req.cookies["token"], { secret: secretJwt });

        return await this.service.getMusicIdById(skip, 5, user["_id"]);

    }
    @Get("audio/:id")
    async getMusic(@Req() req:Request, @Res() res:Response) {
        await this.service.getMusic(req.params["id"], req, res); 
    }
}
