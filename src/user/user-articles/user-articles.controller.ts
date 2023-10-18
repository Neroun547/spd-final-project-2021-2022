import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { UserArticlesService } from "./service/user-articles.service";
import {JwtService} from "@nestjs/jwt";
import {secretJwt} from "../../../config.json";
import {CommonService} from "../../../common/service/common.service";

@Controller()
export class UserArticlesController {
    constructor(
        private userArticlesService: UserArticlesService,
        private jwtService: JwtService,
        private commonService: CommonService
    ) {}

    @Get("back/:idArticle")
    async goBackToArticles(@Param("idArticle") idArticle: string, @Res() res: Response) {
        const username = await this.userArticlesService.getAuthorUsernameByArticleId(idArticle);
        res.redirect("/user/articles/" + username);
    }

    @Get("load-more-articles")
    async loadMoreArticles(
        @Query("skip", new ParseIntPipe()) skip,
        @Query("username") username: string,
        @Query("theme") theme: string
    ) {
        if(!theme && !username) {
            return await this.userArticlesService.getArticles(5, skip);
        }
        if(theme) {
            return await this.userArticlesService.getArticlesByTheme(5, skip, theme);
        }
        if(theme && username) {
            return await this.userArticlesService.getArticlesByUsernameAndTheme(username, theme, skip, 5);
        }
        return await this.userArticlesService.getArticlesByUsername(username, skip, 5);
    }

    @Get("all")
    async getArticlesPage(@Req() req: Request, @Res() res: Response) {
        const articles = await this.userArticlesService.getArticles(5, 0);
        const user = await this.commonService.getAuthUserFromRequest(req);

        if(user) {
            res.render("modules/articles/articles", {
                auth: true,
                articles: articles,
                loadMore: articles.length === 5,
                idAvatar: user["idAvatar"],
                username: user["username"],
                styles: ["/css/user/another-user.css"],
                scripts: ["/js/modules/another-user/another-user-articles/another-user-articles.js"]
            });
        } else {
            res.render("modules/articles/articles", {
                auth: false,
                loadMore: articles.length === 5,
                articles: articles,
                styles: ["/css/user/another-user.css"],
                scripts: ["/js/modules/another-user/another-user-articles/another-user-articles.js"]
            });
        }
    }

    @Get(":username")
    async articlesUser(@Param("username") username: string, @Req() req: Request, @Res() res: Response) {
        let idAvatar;
        let countArticles;

        if(username) {
            idAvatar = await this.userArticlesService.getIdAvatar(username);
            countArticles = await this.userArticlesService.getCountArticles(username);
        }
        const authUser = await this.commonService.getAuthUserFromRequest(req);

        if(authUser && authUser["username"] === username) {
            const articles = await this.userArticlesService.getArticlesByUserId(authUser["_id"], 0, 5);

            res.render("modules/articles/my-articles", {
                username: authUser["username"],
                auth: true,
                idAvatar: authUser["idAvatar"],
                styles: ["/css/articles/my-articles.css"],
                articles,
                loadMore: countArticles > 5,
                scripts: ["/js/modules/my-account/my-articles/my-articles.js"]
            });
        } else if(authUser && authUser["username"] !== username) {
            const alreadyFriend = await this.userArticlesService.alreadyFriend(req.params["username"], authUser["_id"]);
            const articles = await this.userArticlesService.getArticlesByUsername(req.params["username"], 0, 5);

            res.render("modules/articles/user-articles", {
                auth: true,
                username: authUser["username"],
                idAvatar: authUser["idAvatar"],
                articles: articles,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                loadMore: countArticles > 5,
                styles: ["/css/user/another-user.css"],
                scripts: ["/js/modules/another-user/another-user-articles/another-user-articles.js"],
                alreadyFriend: alreadyFriend.accept,
                pendingFriend: alreadyFriend.pending
            });
        } else {
            const articles = await this.userArticlesService.getArticlesByUsername(req.params["username"], 0, 5);
            res.render("modules/articles/user-articles", {
                auth: false,
                articles: articles,
                activeUser: req.params["username"],
                avatarAnotherUser: idAvatar,
                loadMore: countArticles > 5,
                styles: ["/css/user/another-user.css"],
                scripts: ["/js/modules/another-user/another-user-articles/another-user-articles.js"],
            });
        }
    }

    @Get("article/:idArticle")
    async loadArticle(@Param("idArticle") idArticle: string, @Query("arrow") arrow: string, @Req() req: Request, @Res() res: Response) {
        const article = await this.userArticlesService.getArticle(idArticle);

        try {
            const user = this.jwtService.verify(req.cookies["token"], {secret: secretJwt});
            res.render(`articles/${article.article}`, {
                auth: true,
                username: user.username,
                idAvatar: user.idAvatar,
                styles: ["/css/articles/article.css"],
                scripts: arrow && arrow === "true" ? ["/js/modules/another-user/another-user-articles/another-user-article.js"] : []
            });
        } catch {
            res.render(`articles/${article.article}`, {
                auth: false,
                styles: ["/css/articles/article.css"],
                scripts: arrow && arrow === "true" ? ["/js/modules/another-user/another-user-articles/another-user-article.js"] : []
            });
        }
    }
}
