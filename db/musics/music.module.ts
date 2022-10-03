import { Module } from "@nestjs/common";
import { MusicServiceDb } from "./music.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MusicRepository } from "./music.repository";

@Module({
    imports:[TypeOrmModule.forFeature([MusicRepository])],
    providers: [MusicServiceDb],
    exports: [MusicServiceDb]
})
export class MusicsModuleDb { }
