import { Injectable } from "@nestjs/common";
import { ArticlesServiceDb } from "../../../../db/articles/articles.service";
import { UserServiceDb } from "../../../../db/user/user.service";
import { IArticle } from "../interface/article.interface";

@Injectable()
export class UserArticlesService {
    constructor(
        private articlesServiceDb: ArticlesServiceDb,
        private userServiceDb: UserServiceDb
    ) {}

    async getIdAvatar(username: string){
        const user = await this.userServiceDb.findUserByUsername(username);
        return user.idAvatar;
    }

    async getArticlesByUserId(publicateUser: number, skip: number, take: number): Promise<IArticle []> {
        const articles = await this.articlesServiceDb.getArticlesByPublicateUser(publicateUser, skip, take);

        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }

    async getArticlesByUsername(username: string, skip: number, take: number): Promise<IArticle[]> {
        const user = await this.userServiceDb.findUserByUsername(username);
        const articles = await this.articlesServiceDb.getArticlesByPublicateUser(user._id, skip, take);

        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }

    async getCountArticles(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username);
        return await this.articlesServiceDb.getCountArticles(user._id);
    }

    async getArticle(idArticle: string) {
        return await this.articlesServiceDb.getArticleById(idArticle);
    }

    async getArticlesByUsernameAndTheme(username: string, theme: string, skip: number, take: number): Promise<IArticle[]> {
        const userId = await this.userServiceDb.getIdUserByUsername(username);
        const articles = await this.articlesServiceDb.getArticlesByUsernameAndLikeTheme(userId, theme, skip, take);

        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }

    async getArticlesLikeTheme(theme: string, skip: number, take: number) {
        return await this.articlesServiceDb.getArticlesLikeTheme(theme, skip, take);
    }

    async getArticles(take: number, skip: number) {
        return await this.articlesServiceDb.getArticlesDesc(take, skip);
    }

    async getArticlesByTheme(take: number, skip: number, theme: string) {
        return await this.articlesServiceDb.getArticlesByThemeDesc(take, skip, theme);
    }

    async getAuthorUsernameByArticleId(articleId: string) {
        const articleAuthor = (await this.articlesServiceDb.getArticleById(articleId)).publicateUser;

        return (await this.userServiceDb.findUserById(articleAuthor)).username;
    }
}
