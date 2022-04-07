import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AnotherUserService } from "./service/AnotherUser.service";

@Controller()
export class UserController {
    constructor(private service: AnotherUserService){}

    @Get(":username")
    async userPage(@Req() req: Request, @Res() res: Response) {
        const idAvatar = await this.service.getIdAvatar(req.params["username"]);
        const photo = await this.service.getPhotoId(req.params["username"]);
        const countPhoto = await this.service.getCountPhoto(req.params["username"]);

        if(req["user"]) {

            if(req["user"].username === req.params["username"]) {
                res.redirect("/my-photo");
                return;
            }

            const alreadyFriend = await this.service.alreadyFriend(req.params["username"], req["user"]._id);

            res.render("user", {
                idAvatar: req["user"].idAvatar,
                auth: true,
                avatarAnotherUser: idAvatar,
                photo: photo,
                activeUser: req.params["username"],
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                loadMore: countPhoto > 4 ? true : false,
                script: "/js/another-user-photo.js",
                style: "/css/another-user.css"
            });

            return;
        }
        
        res.render("user", {
            idAvatar: false,
            auth: false,
            avatarAnotherUser: idAvatar,
            photo: photo,
            activeUser: req.params["username"],
            loadMore: countPhoto > 4 ? true : false,
            script: "/js/another-user-photo.js",
            style: "/css/another-user.css"
        });
    }

    @Get("music-user/:username")
    async musicUser(@Req() req: Request, @Res() res: Response) {
        const idAvatar = await this.service.getIdAvatar(req.params["username"]);
        const dataMusic = await this.service.getMusicUserId(req.params["username"]);
        const countMusic = await this.service.getCountMusic(req.params["username"]);

        if(req["user"]) {
            const alreadyFriend = await this.service.alreadyFriend(req.params["username"], req["user"]._id);

            res.render("user-music", {
                music: dataMusic,
                auth: true,
                idAvatar: req["user"].idAvatar,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                loadMoreMusic: countMusic > 5 ? true : false,
                script: "/js/another-user-music.js",
                style: "/css/another-user.css"
            });

            return;
        }

        res.render("user-music", {
            music: dataMusic,
            auth: false,
            idAvatar: false,
            activeUser: req.params["username"],
            avatarAnotherUser: idAvatar,
            loadMoreMusic: countMusic > 5 ? true : false,
            script: "/js/another-user-music.js",
            style: "/css/another-user.css"
        });        
    }

    @Get("video-user/:username")
    async videoUser(@Req() req: Request, @Res() res: Response) {
        const dataVideo = await this.service.getVideoId(req.params["username"]);
        const idAvatar = await this.service.getIdAvatar(req.params["username"]);
        const countVideo = await this.service.getCountVideo(req.params["username"]);

        if(req["user"]) {
            const alreadyFriend = await this.service.alreadyFriend(req.params["username"], req["user"]._id);

            res.render("user-video", {
                video:dataVideo,
                auth: true,
                idAvatar: req["user"].idAvatar,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending,
                loadMoreVideo: countVideo > 2 ? true : false,
                script: "/js/another-user-video.js",
                style: "/css/another-user.css"
            });
        
            return;
        }

        res.render("user-video", {
            video:dataVideo,
            auth: false,
            activeUser: req.params["username"],
            avatarAnotherUser: idAvatar,
            loadMoreVideo: countVideo > 2 ? true : false,
            script: "/js/another-user-video.js",
            style: "/css/another-user.css"
        });
    }

    @Get("articles-user/:username")
    async articlesUser(@Req() req: Request, @Res() res: Response) {
        const idAvatar = await this.service.getIdAvatar(req.params["username"]);
        const articles = await this.service.getArticles(req.params["username"], 0);
        const countArticles = await this.service.getCountArticles(req.params["username"]);

        if(req["user"]) {
            const alreadyFriend = await this.service.alreadyFriend(req.params["username"], req["user"]._id);

            res.render("user-articles", {
                auth: true,
                articles: articles,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                loadMore: countArticles > 5 ? true : false,
                style: "/css/another-user.css",
                script: "/js/another-user-articles.js",
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending
            });

            return;
        }
        res.render("user-articles", {
            auth: false,
            articles: articles,
            activeUser: req.params["username"],
            avatarAnotherUser: idAvatar,
            loadMore: countArticles > 5 ? true : false,
            style: "/css/another-user.css",
            script: "/js/another-user-articles.js"
        });
    }

    @Get("add-friend/:username")
    async addFriend(@Req() req: Request, @Res() res: Response) {
        await this.service.addFriend(req.params["username"], req["user"]._id);

        res.redirect(`/user/${req.params["username"]}`);
    }

    @Get("load-more-articles/:skip")
    async loadMoreArticles(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string, @Res() res: Response) {
        const articles = await this.service.getArticles(username, skip);
        res.send(articles);
    }

    @Get("load-more-photo/:skip")
    async loadMorePhotoId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string, @Res() res: Response) {
        const photo = await this.service.loadMorePhotoId(username, skip);

        res.send(photo);
    }

    @Get("load-more-video/:skip")
    async loadMoreVideoId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string, @Res() res: Response) {
        const video = await this.service.loadMoreVideoId(username, skip);

        res.send(video);
    }

    @Get("load-more-music/:skip")
    async loadMoreMusicId(@Req() req: Request, @Param("skip", new ParseIntPipe()) skip: number,
    @Query("user") username: string, @Res() res: Response) {
        const music = await this.service.loadMoreMusicId(username, skip);
    
        res.send(music);
    }

};
