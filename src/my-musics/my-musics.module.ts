import { Module } from "@nestjs/common";
import { MyMusicsController } from "./my-musics.controller";
import { MyMusicsService } from "./service/myMusics.service";
import { MusicsModuleDb } from "../../db/musics/musics.module";

@Module({
    imports:[MusicsModuleDb],
    controllers:[MyMusicsController],
    providers:[MyMusicsService]
})
export class MyMusicsModule { }