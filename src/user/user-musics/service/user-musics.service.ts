import { Injectable } from "@nestjs/common";
import { FriendsService } from "entities/friends/friends.service";
import { FriendPandingService } from "entities/friendsPanding/friendPanding.service";
import { MusicsService } from "entities/musics/musics.service";
import { UserService } from "entities/user/user.service";
import { createReadStream, existsSync, statSync } from "fs";
import { Request, Response } from "express";  
import { resolve } from "path";

@Injectable()
export class UserMusicsService {
    constructor(
        private userServiceDb: UserService,
        private friendsServiceDb: FriendsService,
        private friendPandingServiceDb: FriendPandingService,
        private musicsServiceDb: MusicsService
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
    async getMusicIdByUsername(skip: number, countMusic: number, username: string) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const dataUserMusic = await this.musicsServiceDb.getMusics(skip, countMusic, user._id);

        return dataUserMusic.map((el) => ({
            idMusic: el.idMusic,
            name: el.name,
            author: el.author
        }));
    }

    async getMusicIdById(skip: number, countMusic: number, publicateUser: number) {
        const musics = await this.musicsServiceDb.getMusics(skip, countMusic, publicateUser);
        
        return musics.map((el) => ({
            idMusic: el.idMusic,
            author: el.author,
            name: el.name
        }));
    }

    async getMusic(id: string, req: Request, res: Response) {
        const filename = await this.musicsServiceDb.getMusicsById(id);

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

    async getCountMusicById(publicateUser: number) {
        return await this.musicsServiceDb.getCountMusics(publicateUser);
    }

    async getCountMusicByUsername(username: string) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        
        return await this.musicsServiceDb.getCountMusics(user._id); 
    }
}
