import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";    
import { Request, Response } from "express";
import { UserArticlesService } from "./service/user-articles.service";
import {JwtService} from "@nestjs/jwt";
import {secretJwt} from "../../../config.json";

@Controller()
export class UserArticlesController {
    constructor(
        private service: UserArticlesService,
        private jwtService: JwtService
    ) {}


    @Get("load-articles-by-theme")
    async loadArticleByTheme(@Query("theme") theme: string, @Query("username") username: string) {
        const articles = await this.service.getArticlesByUsernameAndTheme(username, theme, 0, 5);
        
        return articles;
    }

    @Get("load-more-articles-by-theme")
    async loadMoreArticlesByTheme(@Query("theme") theme: string, @Query("username") username: string, @Query("skip") skip: number) {
        const articles = await this.service.getArticlesByUsernameAndTheme(username, theme, skip, 5);

        return articles;
    }

    @Get(":username")
    async articlesUser(@Req() req: Request, @Res() res: Response) {
        const idAvatar = await this.service.getIdAvatar(req.params["username"]);
        const countArticles = await this.service.getCountArticles(req.params["username"]);
        let user;

        try {
            user = this.jwtService.verify(req.cookies["token"], {secret: secretJwt});
        } catch {
            const articles = await this.service.getArticlesByUsername(req.params["username"], 0, 5);

            res.render("user-articles", {
                auth: false,
                articles: articles,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                loadMore: countArticles > 5 ? true : false,
                style: "/css/another-user.css",
                script: "/js/modules/another-user/another-user-articles/another-user-articles.js",
            });

            return;
        }

        if(user.username === req.params["username"]) {
            const articles = await this.service.getArticlesByUserId(user["_id"], 0, 5);
        
            res.render("my-articles", {
                username: user.username,
                auth: true,
                idAvatar: user.idAvatar,
                style: "/css/my-articles.css",
                articles,
                loadMore: countArticles > 5 ? true : false,
                script: "/js/modules/my-account/my-articles/my-articles.js"
            });

            return;
        }
        if(user.username !== req.params["username"]) {
            const alreadyFriend = await this.service.alreadyFriend(req.params["username"], user._id);
            const articles = await this.service.getArticlesByUsername(req.params["username"], 0, 5);

            res.render("user-articles", {
                auth: true,
                username: user.username,
                idAvatar: user.idAvatar,
                articles: articles,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                loadMore: countArticles > 5 ? true : false,
                style: "/css/another-user.css",
                script: "/js/modules/another-user/another-user-articles/another-user-articles.js",
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending
            });

            return;
        }
    }

    @Get("article/:idArticle")
    async loadArticle(@Param("idArticle") idArticle: string, @Req() req: Request, @Res() res: Response) {
        const article = await this.service.getArticle(idArticle);

        try {
            const user = this.jwtService.verify(req.cookies["token"], {secret: secretJwt});
            res.render(`articles/${article.article}`, {
                auth: true,
                username: user.username,
                idAvatar: user.idAvatar,
                style: "/css/article.css"
            });
        } catch {
            res.render(`articles/${article.article}`, {
                auth: false,
                style: "/css/article.css"
            });
        }
    }

    @Get("load-more-articles/:skip")
    async loadMoreArticles(@Param("skip", new ParseIntPipe()) skip: number, @Query("user") username: string) {
        return await this.service.getArticlesByUsername(username, skip, 5);
    }
};

