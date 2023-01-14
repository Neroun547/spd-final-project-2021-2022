import { Module } from "@nestjs/common";
import { MyArticlesController } from "./my-articles.controller";
import { MyArticlesService } from "./service/my-articles.service";
import { ArticlesModuleDb } from "../../db/articles/articles.module";

@Module({
    imports: [ArticlesModuleDb],
    controllers: [MyArticlesController],
    providers: [MyArticlesService]
})
export class MyArticle {};
