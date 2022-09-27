import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticlesRepository } from "./articles.repository";
import { ArticlesServiceDb } from "./articles.service";

@Module({
    imports: [TypeOrmModule.forFeature([ArticlesRepository])],
    providers: [ArticlesServiceDb],
    exports: [ArticlesServiceDb]
})
export class ArticlesModuleDb {};
