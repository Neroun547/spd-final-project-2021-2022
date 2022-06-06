import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";    
import { Request, Response } from "express";
import { UserArticlesService } from "./service/user-articles.service";

@Controller()
export class UserArticlesController {
    constructor(private service: UserArticlesService) {}


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

        if(req["user"] && req["user"].username === req.params["username"]) {
            const articles = await this.service.getArticlesByUserId(req["user"]._id, 0, 5);
        
            res.render("my-articles", {
                username: req["user"].username,
                auth: true,
                idAvatar: req["user"].idAvatar,
                style: "/css/my-articles.css",
                articles,
                loadMore: countArticles > 5 ? true : false,
                script: "/js/modules/my-account/my-articles/my-articles.js"
            });

            return;
        }
        if(req["user"] && req["user"].username !== req.params["username"]) {    
            const alreadyFriend = await this.service.alreadyFriend(req.params["username"], req["user"]._id);
            const articles = await this.service.getArticlesByUsername(req.params["username"], 0, 5);

            res.render("user-articles", {
                auth: true,
                username: req["user"].username,
                idAvatar: req["user"].idAvatar,
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
    }

    @Get("article/:idArticle")
    async loadArticle(@Param("idArticle") idArticle: string, @Req() req: Request, @Res() res: Response) {
        const article = await this.service.getArticle(idArticle);
        
        if(req["user"]) {
            res.render(`articles/${article.article}`, {
                auth: true,
                username: req["user"].username,
                idAvatar: req["user"].idAvatar,
                style: "/css/article.css"
            });

            return;
        }

        res.render(`articles/${article.article}`, {
            auth: false,
            style: "/css/article.css"
        });
    }

    @Get("load-more-articles/:skip")
    async loadMoreArticles(@Param("skip", new ParseIntPipe()) skip: number, @Query("user") username: string) {
        const articles = await this.service.getArticlesByUsername(username, skip, 5);
        
        return articles       
    }
};

