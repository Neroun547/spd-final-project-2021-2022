import { Injectable, NotFoundException } from "@nestjs/common";
import { unlink } from "fs/promises";
import { createWriteStream, existsSync } from "fs"; 
import { resolve } from "path";
import { convertToHtml } from "mammoth";
import { ArticlesServiceDb } from "db/articles/articles.service";
import { IMyArticles } from "../interfaces/my-articles.interface";
import { v4 as uuidv4 } from 'uuid';
import { UploadArticleWithHtmlDto } from "../dto/upload-article-with-html.dto";
import {UploadArticleDto} from "../dto/upload-article.dto";

@Injectable()
export class MyArticlesService {
    constructor(private readonly articlesServiceDb: ArticlesServiceDb){}

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

    async deleteArticle(idArticle: string, publicateUser: number) {
        const article = await this.articlesServiceDb.getArticleById(idArticle);

        await this.articlesServiceDb.deleteArticleById(idArticle, publicateUser);

        if(existsSync(`views/articles/${article.article}`)) {
            await unlink(`views/articles/${article.article}`);

            return;
        } 
        throw new NotFoundException();
    }

    async writeArticleWithHtml(article: UploadArticleWithHtmlDto, idUser: number) {
        const nameArticle = Date.now();
        const writeStream = createWriteStream(resolve(`views/articles/${nameArticle}.hbs`));
        
        writeStream.write(`<div class="wrapper__about">`);
        writeStream.write(article.content);
        writeStream.write(`</div>`);
        writeStream.end();

        await this.articlesServiceDb.saveArticle({
            publicateUser: idUser,
            theme: article.theme,
            title: article.title,
            article: `${nameArticle}.hbs`,
            idArticle: uuidv4(),
            date: new Date()
        });
    }

    async changeParamsArticle(params: UploadArticleDto, publicateUser: number, idArticle: string) {
        await this.articlesServiceDb.changeParamsArticle(publicateUser, idArticle, params.theme, params.title);
    }
}
