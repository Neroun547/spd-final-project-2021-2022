import { Module } from "@nestjs/common";
import { MusicsServiceDb } from "./musics.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MusicsRepository } from "./musics.repository";

@Module({
    imports:[TypeOrmModule.forFeature([MusicsRepository])],
    providers: [MusicsServiceDb],
    exports: [MusicsServiceDb]
})
export class MusicsModuleDb { }
