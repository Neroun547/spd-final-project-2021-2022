import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { VideoServiceDb } from "../../../db/video/video.service";
import { resolve } from "path";
import { createReadStream, existsSync, statSync } from "fs";
import { Request, Response } from "express";
import { unlink } from "fs/promises";
import { UploadVideo } from "../interfaces/upload-video.interface";
import { PrivateVideoServiceDb } from "../../../db/private-video/private-video.service";

@Injectable()
export class MyVideo {
    constructor(private readonly videoServiceDb: VideoServiceDb, private readonly privateVideoServiceDb: PrivateVideoServiceDb) {};

    async uploadNewVideo(infoVideo: UploadVideo) {
        await this.videoServiceDb.saveVideo({
            name: infoVideo.name,   
            video: infoVideo.video,
            publicateUser: infoVideo.publicateUser,
            idVideo: infoVideo.idVideo,
            description: infoVideo.description ? infoVideo.description : ""  
        });
    }
    async getPrivateVideo(id: string, req: Request, res: Response) {
        const filename = await this.privateVideoServiceDb.getPrivateVideoById(id);

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
        const deleteVideo = await this.videoServiceDb.deleteVideo(id, publicateUser);

        if(existsSync(resolve(`video/${deleteVideo.video}`))) {
            await unlink(resolve(`video/${deleteVideo.video}`)); 

            return;
        }
        throw new NotFoundException();
    }

    async deletePrivateVideo(id: string, publicateUser: number) {
        const deleteVideo = await this.privateVideoServiceDb.deletePrivateVideo(id, publicateUser);

        if(existsSync(resolve(`video/${deleteVideo.video}`))) {
            await unlink(resolve(`video/${deleteVideo.video}`)); 

            return;
        }
        throw new NotFoundException();
    }

    async getCountPrivateVideo(publicateUser: number) {
        return await this.privateVideoServiceDb.getCountPrivateVideo(publicateUser);
    }

    async getPrivateVideoId(publicateUser: number, countVideo: number, skipVideo: number) {
        const video = await this.privateVideoServiceDb.getPrivateVideo(publicateUser, countVideo, skipVideo);

        return video.map((el) => ({
            idVideo: el.idVideo,
            name: el.name,
            description: el.description
        }));
    }

    async uploadNewPrivateVideo(infoVideo: UploadVideo) {
        await this.privateVideoServiceDb.savePrivateVideo({
            name: infoVideo.name,   
            video: infoVideo.video,
            publicateUser: infoVideo.publicateUser,
            idVideo: infoVideo.idVideo,
            description: infoVideo.description ? infoVideo.description : ""  
        });
    }

    async makePrivateVideo(id: string, idUser: number) {
        const video = await this.videoServiceDb.getVideoById(id);
        
        if(!video) {
            throw new BadRequestException();
        }
        if(video.publicateUser !== idUser) {
            throw new InternalServerErrorException();
        }
        await this.videoServiceDb.deleteVideo(id, idUser);

        await this.privateVideoServiceDb.savePrivateVideo(video);
    }

    async makePublicVideo(id: string, idUser: number) {
        const video = await this.privateVideoServiceDb.getPrivateVideoById(id);

        if(!video) {
            throw new NotFoundException();
        }
        if(video.publicateUser !== idUser) {
            throw new InternalServerErrorException();
        }
        await this.privateVideoServiceDb.deletePrivateVideo(id, idUser);

        await this.videoServiceDb.saveVideo(video);
    }

    async changeParamsVideo(publicateUser: number, name: string, description: string, idVideo: string, isPrivate: boolean) {
        
        if(!isPrivate) {
            const existsVideo = await this.videoServiceDb.getVideoById(idVideo);
            
            if(!existsVideo) {
                throw new NotFoundException();
            }
            if(existsVideo.publicateUser !== publicateUser) {
                throw new InternalServerErrorException();
            }
            await this.videoServiceDb.updateParamsVideo(publicateUser, name, description, idVideo);

            return;
        }
        if(isPrivate) {
            const existsVideo = await this.privateVideoServiceDb.getPrivateVideoById(idVideo);

            if(!existsVideo) {
                throw new NotFoundException();
            }
            if(existsVideo.publicateUser !== publicateUser) {
                throw new InternalServerErrorException();
            }
            await this.privateVideoServiceDb.updateParamsPrivateVideo(publicateUser, name, description, idVideo);

            return;
        }
    }   
};
