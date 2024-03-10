import { Injectable } from "@nestjs/common";
import { ArticlesRepository } from "./articles.repository";
import { ArticlesInterface } from "./interfaces/articles.interface";

@Injectable()
export class ArticlesServiceDb {
    constructor(private readonly repository: ArticlesRepository) {};

    async saveArticle(article: ArticlesInterface) {
        await this.repository.save({ ...article });
    }

    async getArticlesByUserId(userId: number, skip: number, take: number) {
        return await this.repository.find({ where: { user_id: userId }, skip, take, order: {  _id: "DESC"}});
    }

    async getCountArticles(userId: number) {
        return await this.repository.count({ where: { user_id: userId } });
    }

    async getArticleById(idArticle: string) {
        return await this.repository.findOne({ idArticle });
    }

    async deleteArticleById(idArticle: string, userId: number) {
        await this.repository.delete({ idArticle: idArticle, user_id: userId });
    }

    async getArticlesByUsernameAndLikeTheme(userId: number, theme: string, skip: number, take: number) {
        return await this.repository.createQueryBuilder("articles")
        .where("articles.user_id = :author AND articles.theme LIKE :theme", { user_id: userId, theme: `%${theme}%` })
        .orderBy({  _id: "DESC"})
        .skip(skip)
        .take(take)
        .getMany()
    }

    async getArticlesLikeTheme(theme: string, skip: number, take: number) {
        return await this.repository.createQueryBuilder("articles")
            .where("articles.theme LIKE :theme", { theme: `%${theme}%` })
            .orderBy({  _id: "DESC"})
            .skip(skip)
            .take(take)
            .getMany()
    }

    async getAllArticlesByUserId(userId: number) {
        return await this.repository.find({ user_id: userId });
    }

    async deleteAllArticlesByUserId(userId: number) {
        await this.repository.delete({  user_id: userId });
    }

    async changeParamsArticle(userId: number, idArticle: string, theme: string, title: string) {
        await this.repository.update({ user_id: userId, idArticle: idArticle }, { theme: theme, title: title });
    }

    async getArticlesAndAuthorsDesc(take: number, skip: number) {
        return await this.repository.find({ where: {}, skip: skip, take: take, order: { _id: "DESC" }, relations: ["user"] });
    }

    async getArticlesByThemeDesc(take: number, skip: number, theme: string) {
        return await this.repository.find({ where: { theme: theme }, take: take, skip: skip, order: { _id: "DESC" } });
    }

    async getArticleByArticleIdAndUserId(idArticle: string, userId: number) {
        return await this.repository.findOne({ idArticle: idArticle, user_id: userId });
    }
}
