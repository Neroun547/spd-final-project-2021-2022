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

    async getMusicsId(skip: number, countMusic: number, publicateUser: string) {
        const musics = await this.musicsService.getMusics(skip, countMusic, publicateUser);
        
        return musics.map((el) => ({
            idMusic: el.idMusic,
            author: el.author,
            name: el.name
        }));
    }

    async getMusics(id: string, req: Request, res: Response) {
        const filename = await this.musicsService.getMusicsById(id);

        if(!existsSync(resolve(`musics/${filename.music}`))) {
            res.sendStatus(404);
        }

        const stat = statSync(`musics/${filename.music}`);
        const total = stat.size;
      
        if (req.headers.range) {
            const range = req.headers.range;
            const parts = range.replace(/bytes=/, "").split("-");
            const partialstart = parts[0];
            const partialend = parts[1];
      
            const start = parseInt(partialstart, 10);
            const end = partialend ? parseInt(partialend, 10) : total-1;
            const chunksize = (end-start)+1;
      
            const videoFile = createReadStream(`musics/${filename.music}`, {start: start, end: end});
            res.writeHead(206, { 
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'audio/mpeg' 
            });

            videoFile.pipe(res);
            
            return;
        }
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        createReadStream(resolve("video/"+filename.music)).pipe(res);
    }

    async getCount(publicateUser: string) {
        return await this.musicsService.getCountMusics(publicateUser);
    }

    async deleteMusic(idMusic: string, publicateUser: string) {
        const deleteMusic = await this.musicsService.deleteMusic(idMusic, publicateUser);
        await unlink(resolve(`musics/${deleteMusic.music}`));
    }
}
