import { Injectable, NotFoundException } from "@nestjs/common";
import { unlink } from "fs/promises";
import { createWriteStream, existsSync } from "fs";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { ArticlesServiceDb } from "db/articles/articles.service";
import { v4 as uuidv4 } from 'uuid';
import {UploadArticleDto} from "../dto/upload-article.dto";
import {ChangeParamsDto} from "../dto/change-params.dto";

@Injectable()
export class MyArticlesService {
    constructor(private readonly articlesServiceDb: ArticlesServiceDb){}

    async deleteArticle(idArticle: string, publicateUser: number) {
        const article = await this.articlesServiceDb.getArticleById(idArticle);

        await this.articlesServiceDb.deleteArticleById(idArticle, publicateUser);

        if(existsSync(`views/articles/${article.article}`)) {
            await unlink(`views/articles/${article.article}`);

            return;
        }
        throw new NotFoundException();
    }

    async writeArticleWithHtml(article: UploadArticleDto, idUser: number) {
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

    async editArticleByArticleId(content: string, idArticle: string, authorId: number) {
        const articleInDb = await this.articlesServiceDb.getArticleByArticleIdAndAuthorId(idArticle, authorId);

        if(articleInDb) {
            const writeStream = createWriteStream(resolve(`views/articles/${articleInDb.article}`));

            writeStream.write(`<div class="wrapper__about">`);
            writeStream.write(content);
            writeStream.write(`</div>`);
            writeStream.end();
        } else {
            throw new NotFoundException();
        }
    }

    async changeParamsArticle(params: ChangeParamsDto, publicateUser: number, idArticle: string) {
        await this.articlesServiceDb.changeParamsArticle(publicateUser, idArticle, params.theme, params.title);
    }

    async getArticleContentByArticleId(idArticle: string) {
        const articleInDb = await this.articlesServiceDb.getArticleById(idArticle);

        if(articleInDb && existsSync(resolve(`views/articles/${articleInDb.article}`))) {
            return (await readFile(resolve(`views/articles/${articleInDb.article}`))).toString();
        }
        throw new NotFoundException();
    }
}
