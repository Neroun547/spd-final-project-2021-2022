import { Injectable, NotFoundException } from "@nestjs/common";
import { MusicsServiceDb } from "../../../db/musics/musics.service";
import { UploadMusic } from "../interfaces/upload-music.interface";
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from "fs";
import { unlink } from "fs/promises";
import { resolve } from "path";

@Injectable()
export class MyMusicsService {
    constructor(private musicsService: MusicsServiceDb){}

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
