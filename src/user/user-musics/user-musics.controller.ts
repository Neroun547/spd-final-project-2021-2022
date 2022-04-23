import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";  
import { UserMusicsService } from "./service/user-musics.service";

@Controller()
export class UserMusicsController {
    constructor(private service: UserMusicsService) { }; 

    @Get(":username")
    async musicUser(@Req() req: Request, @Res() res: Response, @Param("username") username: string) {
        
        if(req["user"] && req["user"].username === username) {
            const dataMusic = await this.service.getMusicIdById(0, 5, req["user"]._id);
            const countMusic = await this.service.getCountMusicById(req["user"]._id);

            res.render("my-musics", {
                username: req["user"].username,
                auth: true,
                idAvatar: req["user"].idAvatar,
                musics: dataMusic,
                loadMore: countMusic > 5 ? true : false,
                countMusic: countMusic,
                script:"/js/modules/my-account/my-music/my-music.js",
                style: "/css/my-musics.css"
            });

            return;
        }
        const dataMusic = await this.service.getMusicIdByUsername(0, 5, username);
        const countMusic = await this.service.getCountMusicByUsername(username);
        const idAvatar = await this.service.getIdAvatar(username);

        if(req["user"] && req["user"].username !== username) {
            const alreadyFriend = await this.service.alreadyFriend(username, req["user"]._id);

            res.render("user-music", {
                username: req["user"].username,
                music: dataMusic,
                auth: true,
                idAvatar: req["user"].idAvatar,
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
    }
    @Get("load-more-music/:skip")
    async loadMoreMusicId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string, @Res() res: Response) {

        if(username) {
            const music = await this.service.getMusicIdByUsername(skip, 5, username);
    
            res.send(music);
            return;
        }
        const music = await this.service.getMusicIdById(skip, 5, req["user"]._id);

        res.send(music);
    }
    @Get("audio/:id")
    async getMusic(@Req() req:Request, @Res() res:Response) {
        await this.service.getMusic(req.params["id"], req, res); 
    }
}
