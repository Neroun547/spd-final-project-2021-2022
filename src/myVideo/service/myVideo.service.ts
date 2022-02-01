import { Injectable } from "@nestjs/common";
import { VideoService } from "../../../entities/video/video.service";
import { resolve } from "path";
import { createReadStream, existsSync, statSync } from "fs";
import { Request, Response } from "express";
import { unlink } from "fs/promises";
import { UploadVideo } from "../interfaces/upload-video.interface";

@Injectable()
export class MyVideo {
    constructor(private readonly videoService: VideoService) {};

    async uploadNewVideo(infoVideo: UploadVideo) {
        await this.videoService.saveVideo({
            name: infoVideo.name,   
            video: infoVideo.video,
            publicateUser: infoVideo.publicateUser,
            idVideo: infoVideo.idVideo,
            description: infoVideo.description ? infoVideo.description : ""  
        });
    }

    async getVideoId(publicateUser: number, countVideo: number, skipVideo: number) {
        const video = await this.videoService.getVideo(publicateUser, countVideo, skipVideo);
        
        return video.map((el) => ({
            idVideo: el.idVideo,
            name: el.name,
            description: el.description
        }));
    }

    async getVideo(id: string, req: Request, res: Response) {
        const filename = await this.videoService.getVideoById(id);

        if(!existsSync(resolve(`video/${filename.video}`))) {
            res.sendStatus(404);
        }

        const stat = statSync(`video/${filename.video}`);
        const total = stat.size;
      
        if (req.headers.range) {
            const range = req.headers.range;
            const parts = range.replace(/bytes=/, "").split("-");
            const partialstart = parts[0];
            const partialend = parts[1];
      
            const start = parseInt(partialstart, 10);
            const end = partialend ? parseInt(partialend, 10) : total-1;
            const chunksize = (end-start)+1;
      
            const videoFile = createReadStream(`video/${filename.video}`, {start: start, end: end});
            res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
            videoFile.pipe(res);
            
            return;
        }
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
        createReadStream(resolve("video/"+filename.video)).pipe(res);
    }

    async deleteVideo(id: string, publicateUser: number) {
        const deleteVideo = await this.videoService.deleteVideo(id, publicateUser);
        await unlink(resolve(`video/${deleteVideo.video}`)); 
    }

    async getCountVideo(publicateUser: number) {
        return await this.videoService.getCountVideo(publicateUser);
    }
}
