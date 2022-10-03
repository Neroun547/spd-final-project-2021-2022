import { Injectable, NotFoundException } from "@nestjs/common";
import { MusicServiceDb } from "../../../db/musics/music.service";
import { UploadMusic } from "../interfaces/upload-music.interface";
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import { resolve } from "path";

@Injectable()
export class MyMusicService {
    constructor(private musicsService: MusicServiceDb){}

    async uploadNewMusics(infoMusic: UploadMusic) {
        await this.musicsService.saveMusic({ ...infoMusic, idMusic: uuidv4() });
    }

    async deleteMusic(idMusic: string, publicateUser: number) {
        const deleteMusic = await this.musicsService.deleteMusic(idMusic, publicateUser);

        if(existsSync(resolve(`musics/${deleteMusic.music}`))) {
            await unlink(resolve(`musics/${deleteMusic.music}`));
            
            return;
        }
        throw new NotFoundException();
    }
}
