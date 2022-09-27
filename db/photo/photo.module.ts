import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhotoRepository } from "./photo.repository";
import { PhotoServiceDb } from "./photo.service";

@Module({
    imports:[TypeOrmModule.forFeature([PhotoRepository])],
    providers:[PhotoServiceDb],
    exports:[PhotoServiceDb]
})
export class PhotoModuleDb {};