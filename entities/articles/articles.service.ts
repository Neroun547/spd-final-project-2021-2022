import { Injectable } from "@nestjs/common"; 
import { ArticlesRepository } from "./articles.repository";
import { IArticle } from "./interfaces/articles.interface";

@Injectable()
export class ArticlesService {
    constructor(private readonly repository: ArticlesRepository) {};

    async saveArticle(article: IArticle) {
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
}
