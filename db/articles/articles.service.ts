import { Injectable } from "@nestjs/common"; 
import { ArticlesRepository } from "./articles.repository";
import { ArticlesInterface } from "./interfaces/articles.interface";

@Injectable()
export class ArticlesServiceDb {
    constructor(private readonly repository: ArticlesRepository) {};

    async saveArticle(article: ArticlesInterface) {
        await this.repository.save({ ...article });
    }

    async getArticles(publicateUser: number, skip: number, take: number) {
        return await this.repository.find({ where: { publicateUser }, skip, take, order: {  _id: "DESC"}});
    }

    async getCountArticles(publicateUser: number) {
        return await this.repository.count({ where: { publicateUser } });
    }

    async getArticleById(idArticle: string) {
        return await this.repository.findOne({ idArticle });
    }

    async deleteArticleById(idArticle: string, publicateUser: number) {
        await this.repository.delete({ idArticle, publicateUser });
    }

    async getArticlesByUsernameAndTheme(publicateUser: number, theme: string, skip: number, take: number) {
        return await this.repository.createQueryBuilder("articles")
        .where("articles.publicateUser = :publicateUser AND articles.theme LIKE :theme", { publicateUser: publicateUser, theme: `%${theme}%` })
        .orderBy({  _id: "DESC"})
        .skip(skip)
        .take(take)
        .getMany()
    }

    async getAllArticlesByPublicateUser(publicateUser: number) {
        return await this.repository.find({ publicateUser: publicateUser });
    }

    async deleteAllArticlesByPublicateUser(publicateUser: number) {
        await this.repository.delete({  publicateUser: publicateUser });
    }
}
