import { Injectable } from "@nestjs/common";  
import { FriendsService } from "entities/friends/friends.service";
import { FriendPandingService } from "entities/friendsPanding/friendPanding.service";
import { Request, Response } from "express";
import { UserService } from "entities/user/user.service";
import { VideoService } from "entities/video/video.service";
import { createReadStream, existsSync, statSync } from "fs";
import { resolve } from "path";

@Injectable()
export class UserVideoService {
    constructor(
        private userServiceDb: UserService,
        private friendsServiceDb: FriendsService,
        private friendPandingServiceDb: FriendPandingService,
        private videoServiceDb: VideoService
    ) {}

    async getIdAvatar(username: string){
        const user = await this.userServiceDb.findUserByUsername(username);
        return user.idAvatar;
    }

    async alreadyFriend(friendUsername: string, idUser: number) {
        const friendId = await this.userServiceDb.getIdUserByUsername(friendUsername);
        const alreadyFriend = await this.friendsServiceDb.alreadyFriends(idUser, friendId);
        const pendingFriend = await this.friendPandingServiceDb.findFriend(friendId, idUser);

        if(alreadyFriend) {
            return {
                accept: true,
                pending: false
            }
        }

        if(pendingFriend) {
            return {
                accept: false,
                pending: true
            }
        }

        return {
            accept: false,
            pending: false
        }
    }

    async getVideoIdByUsername(username: string, skip: number, take: number) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const dataUserVideo = await this.videoServiceDb.getVideo(user._id, take, skip);

        return dataUserVideo.map((el) => ({
            idVideo: el.idVideo,
            description: el.description,
            name: el.name
        }));
    }

    async getVideoIdByUserId(author: number, skip: number, take: number) {
        const dataUserVideo = await this.videoServiceDb.getVideo(author, take, skip);

        return dataUserVideo.map((el) => ({
            idVideo: el.idVideo,
            description: el.description,
            name: el.name
        }));
    }

    async getCountVideoByIdUser(author: number) {
        return await this.videoServiceDb.getCountVideo(author);
    }

    async getCountVideoByUsername(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        return await this.videoServiceDb.getCountVideo(user._id);
    }


    async getVideo(id: string, req: Request, res: Response) {
        const filename = await this.videoServiceDb.getVideoById(id);

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
}
