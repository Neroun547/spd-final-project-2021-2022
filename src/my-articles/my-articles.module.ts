import { Module } from "@nestjs/common";
import { MyArticlesController } from "./my-articles.controller";
import { MyArticlesService } from "./service/myArticles.service";
import { ArticlesModuleDb } from "../../db/articles/articles.module";

@Module({
    imports: [ArticlesModuleDb],
    controllers: [MyArticlesController],
    providers: [MyArticlesService]
})
export class MyArticle {};
