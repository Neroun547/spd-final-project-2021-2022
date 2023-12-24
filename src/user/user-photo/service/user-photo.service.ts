import { BadRequestException, Injectable } from "@nestjs/common";
import { PhotoServiceDb } from "../../../../db/photo/photo.service";
import { UserServiceDb } from "../../../../db/user/user.service";
import { createReadStream, existsSync } from "fs";
import { Response } from "express";
import { resolve } from "path";

@Injectable()
export class UserPhotoService {
    constructor(
        private userServiceDb: UserServiceDb,
        private photoServiceDb: PhotoServiceDb
    ) {}

    async getIdAvatar(username: string){
        const user = await this.userServiceDb.findUserByUsername(username);

        return user.idAvatar;
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

