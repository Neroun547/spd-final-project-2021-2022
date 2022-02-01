import { Module } from "@nestjs/common";
import { MyMusicsController } from "./myMusics.controller";
import { MyMusicsService } from "./service/myMusics.service";
import { MusicsEntityModule } from "../../entities/musics/musics.module";

@Module({
    imports:[MusicsEntityModule],
    controllers:[MyMusicsController],
    providers:[MyMusicsService]
})
export class MyMusicsModule { }