import { Module } from "@nestjs/common";
import { MyPhotoController } from "./my-photo.controller";
import { MyPhotoService } from "./service/myPhoto.service";
import { PhotoModuleDb } from "../../db/photo/photo.module";

@Module({
    imports:[PhotoModuleDb],
    controllers:[MyPhotoController],
    providers:[MyPhotoService]
})
export class MyPhotoModule {}
