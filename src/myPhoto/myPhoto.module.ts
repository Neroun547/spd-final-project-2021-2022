import { Module } from "@nestjs/common";
import { MyPhotoController } from "./myPhoto.controller";
import { MyPhotoService } from "./service/myPhoto.service";
import { PhotoEntityModule } from "../entities/photo/photo.module";

@Module({
    imports:[PhotoEntityModule],
    controllers:[MyPhotoController],
    providers:[MyPhotoService]
})
export class MyPhotoModule {}
