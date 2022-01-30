import { Module } from "@nestjs/common";
import { MusicsService } from "./musics.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MusicsRepository } from "./musics.repository";

@Module({
    imports:[TypeOrmModule.forFeature([MusicsRepository])],
    providers: [MusicsService],
    exports: [MusicsService]
})
export class MusicsEntityModule { };