import { Module } from "@nestjs/common";
import { MyMusicController } from "./my-music.controller";
import { MyMusicService } from "./service/my-music.service";
import { MusicsModuleDb } from "../../db/musics/music.module";

@Module({
    imports:[MusicsModuleDb],
    controllers:[MyMusicController],
    providers:[MyMusicService]
})
export class MyMusicModule { }