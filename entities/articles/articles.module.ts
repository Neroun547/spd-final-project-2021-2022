import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticlesRepository } from "./articles.repository";
import { ArticlesService } from "./articles.service"; 

@Module({
    imports: [TypeOrmModule.forFeature([ArticlesRepository])],
    providers: [ArticlesService],
    exports: [ArticlesService]
})
export class ArticlesEntityModule {};
