import { BadRequestException, Injectable } from "@nestjs/common";
import { FriendsService } from "entities/friends/friends.service";
import { FriendPandingService } from "entities/friendsPanding/friendPanding.service";
import { PhotoService } from "entities/photo/photo.service";
import { UserService } from "entities/user/user.service";
import { createReadStream, existsSync } from "fs";
import { Request, Response } from "express";
import { resolve } from "path";

@Injectable()
export class UserPhotoService {
    constructor(
        private userServiceDb: UserService, 
        private friendsServiceDb: FriendsService, 
        private friendPandingServiceDb: FriendPandingService,
        private photoServiceDb: PhotoService    
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
    async getCountPhotoByUsername(author: string) {
        const user = await this.userServiceDb.findUserByUsername(author); 

        return await this.photoServiceDb.getCountPhoto(user._id);
    }

    async getCountPhotoById(author: number) {
        return await this.photoServiceDb.getCountPhoto(author);
    }

    async getPhotoByUsername(username: string, skip: number, take: number) {
        const user = await this.userServiceDb.findUserByUsername(username); 
        const dataUserPhoto = await this.photoServiceDb.findPhotoById(user._id, skip, take);

        return dataUserPhoto.map((el) => ({
            idPhoto: el.idPhoto,
            description: el.description,
            theme: el.theme
        }));
    }

    async getPhotoIdByIdUser(publicateUser: number, skip: number, take: number) { 
        const dataUserPhoto = await this.photoServiceDb.findPhotoById(publicateUser, skip, take);

        return dataUserPhoto.map((el) => ({
            idPhoto: el.idPhoto,
            description: el.description,
            theme: el.theme
        }));
    }

    async getPhoto(id: string, res: Response) {
        const filename = await this.photoServiceDb.getPhotoByIdPhoto(id);
        
        if(existsSync(resolve("photo/"+filename.photo))){
            createReadStream(resolve("photo/"+filename.photo)).pipe(res);
            return;
        }

        throw new BadRequestException();
    }
}

