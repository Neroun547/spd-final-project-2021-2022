import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { VideoService } from "../../../entities/video/video.service";
import { resolve } from "path";
import { createReadStream, existsSync, statSync } from "fs";
import { Request, Response } from "express";
import { unlink } from "fs/promises";
import { UploadVideo } from "../interfaces/upload-video.interface";
import { PrivateVideoService } from "../../../entities/privateVideo/privateVideo.service";

@Injectable()
export class MyVideo {
    constructor(private readonly videoService: VideoService, private readonly privateVideoService: PrivateVideoService) {};

    async uploadNewVideo(infoVideo: UploadVideo) {
        await this.videoService.saveVideo({
            name: infoVideo.name,   
            video: infoVideo.video,
            publicateUser: infoVideo.publicateUser,
            idVideo: infoVideo.idVideo,
            description: infoVideo.description ? infoVideo.description : ""  
        });
    }
    async getPrivateVideo(id: string, req: Request, res: Response) {
        const filename = await this.privateVideoService.getPrivateVideoById(id);

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

        if(existsSync(resolve(`video/${deleteVideo.video}`))) {
            await unlink(resolve(`video/${deleteVideo.video}`)); 

            return;
        }
        throw new NotFoundException();
    }

    async deletePrivateVideo(id: string, publicateUser: number) {
        const deleteVideo = await this.privateVideoService.deletePrivateVideo(id, publicateUser);

        if(existsSync(resolve(`video/${deleteVideo.video}`))) {
            await unlink(resolve(`video/${deleteVideo.video}`)); 

            return;
        }
        throw new NotFoundException();
    }

    async getCountPrivateVideo(publicateUser: number) {
        return await this.privateVideoService.getCountPrivateVideo(publicateUser);
    }

    async getPrivateVideoId(publicateUser: number, countVideo: number, skipVideo: number) {
        const video = await this.privateVideoService.getPrivateVideo(publicateUser, countVideo, skipVideo);

        return video.map((el) => ({
            idVideo: el.idVideo,
            name: el.name,
            description: el.description
        }));
    }

    async uploadNewPrivateVideo(infoVideo: UploadVideo) {
        await this.privateVideoService.savePrivateVideo({
            name: infoVideo.name,   
            video: infoVideo.video,
            publicateUser: infoVideo.publicateUser,
            idVideo: infoVideo.idVideo,
            description: infoVideo.description ? infoVideo.description : ""  
        });
    }

    async makePrivateVideo(id: string, idUser: number) {
        const video = await this.videoService.getVideoById(id);
        
        if(!video) {
            throw new BadRequestException();
        }
        if(video.publicateUser !== idUser) {
            throw new InternalServerErrorException();
        }
        await this.videoService.deleteVideo(id, idUser);

        await this.privateVideoService.savePrivateVideo(video);
    }

    async makePublicVideo(id: string, idUser: number) {
        const video = await this.privateVideoService.getPrivateVideoById(id);

        if(!video) {
            throw new NotFoundException();
        }
        if(video.publicateUser !== idUser) {
            throw new InternalServerErrorException();
        }
        await this.privateVideoService.deletePrivateVideo(id, idUser);

        await this.videoService.saveVideo(video);
    }

    async changeParamsVideo(publicateUser: number, name: string, description: string, idVideo: string, isPrivate: boolean) {
        
        if(!isPrivate) {
            const existsVideo = await this.videoService.getVideoById(idVideo);
            
            if(!existsVideo) {
                throw new NotFoundException();
            }
            if(existsVideo.publicateUser !== publicateUser) {
                throw new InternalServerErrorException();
            }
            await this.videoService.updateParamsVideo(publicateUser, name, description, idVideo);

            return;
        }
        if(isPrivate) {
            const existsVideo = await this.privateVideoService.getPrivateVideoById(idVideo);

            if(!existsVideo) {
                throw new NotFoundException();
            }
            if(existsVideo.publicateUser !== publicateUser) {
                throw new InternalServerErrorException();
            }
            await this.privateVideoService.updateParamsPrivateVideo(publicateUser, name, description, idVideo);

            return;
        }
    }   
};
