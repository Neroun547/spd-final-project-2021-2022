import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhotoRepository } from "./photo.repository";
import { PhotoService } from "./photo.service";

@Module({
    imports:[TypeOrmModule.forFeature([PhotoRepository])],
    providers:[PhotoService],
    exports:[PhotoService]
})
export class PhotoEntityModule {};