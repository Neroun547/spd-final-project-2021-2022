import { Injectable } from "@nestjs/common"; 
import { unlink } from "fs/promises";
import { createWriteStream } from "fs"; 
import { resolve } from "path";
import { convertToHtml } from "mammoth";
import { ArticlesService } from "entities/articles/articles.service";
import { IMyArticles } from "../interfaces/myArticles.interface";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MyArticlesService {
    constructor(private readonly articlesServiceDb: ArticlesService){}

    async convertDocxToHtmlAndDeleteDocx(article: IMyArticles) {
        const resultConvert = await convertToHtml({path: resolve(`views/articles/${article.filename}`)});
        await unlink(resolve(`views/articles/${article.filename}`));

        const nameArticle = Date.now();
        const html = resultConvert.value;
        const writeStream = createWriteStream(resolve(`views/articles/${nameArticle}.hbs`), "utf-8")
        writeStream.write(`<div class="wrapper__about">`);
        writeStream.write(html);
        writeStream.write(`</div>`);
        writeStream.end();

        await this.articlesServiceDb.saveArticle({ 
            publicateUser: article.publicateUser, 
            theme: article.theme,
            title: article.title,
            article: `${nameArticle}.hbs`,
            idArticle: uuidv4(),
            date: new Date()
        });
    }

    async getArticles(publicateUser: number, skip: number, take: number) {
        const articles = await this.articlesServiceDb.getArticles(publicateUser, skip, take);

        return articles.map(el => ({ idArticle: el.idArticle, title: el.title, theme: el.theme, date: el.date }));
    }

    async getArticle(idArticle: string) {
        return await this.articlesServiceDb.getArticleById(idArticle);
    }

    async deleteArticle(idArticle: string, publicateUser: number) {
        const article = await this.articlesServiceDb.getArticleById(idArticle);

        await this.articlesServiceDb.deleteArticleById(idArticle, publicateUser);
        await unlink(`views/articles/${article.article}`);
    }

    async getCountArticles(publicateUser: number) {
        return await this.articlesServiceDb.getCountArticles(publicateUser);
    }
}
