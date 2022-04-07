import { Module } from "@nestjs/common";
import { MyArticlesController } from "./myArticles.controller";
import { MyArticlesService } from "./service/myArticles.service";
import { ArticlesEntityModule } from "../../entities/articles/articles.module";

@Module({
    imports: [ArticlesEntityModule],
    controllers: [MyArticlesController],
    providers: [MyArticlesService]
})
export class MyArticle {};
