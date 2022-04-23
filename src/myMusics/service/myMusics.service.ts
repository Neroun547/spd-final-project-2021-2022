import { Injectable } from "@nestjs/common";
import { MusicsService } from "../../../entities/musics/musics.service";
import { UploadMusic } from "../interfaces/upload-music.interface";
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from "express";
import { createReadStream, existsSync, statSync } from "fs";
import { unlink } from "fs/promises";
import { resolve } from "path";

@Injectable()
export class MyMusicsService {
    constructor(private musicsService:MusicsService){}

    async uploadNewMusics(infoMusic: UploadMusic) {
        await this.musicsService.saveMusic({ ...infoMusic, idMusic: uuidv4() });
    }

    async deleteMusic(idMusic: string, publicateUser: number) {
        const deleteMusic = await this.musicsService.deleteMusic(idMusic, publicateUser);
        await unlink(resolve(`musics/${deleteMusic.music}`));
    }
}
