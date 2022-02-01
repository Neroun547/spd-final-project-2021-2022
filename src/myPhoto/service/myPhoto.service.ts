import { Injectable } from "@nestjs/common";
import { PhotoService } from "../../../entities/photo/photo.service";
import { v4 as uuidv4 } from 'uuid';
import { Response } from "express";
import { createReadStream, existsSync } from "fs";
import { resolve } from "path";
import { unlink } from "fs/promises";
import { UploadPhoto } from "../interfaces/upload-photo.interface";

@Injectable()
export class MyPhotoService {
    constructor(private readonly photoService: PhotoService) { }

    async uploadPhoto(params: UploadPhoto) {
        await this.photoService.savePhoto({ 
            author: params.author,
            theme: params.theme,
            description: params.description,
            photo: params.file.filename,
            idPhoto: uuidv4()
        });
    }

    async loadPhoto(username: string) {
        const photo = await this.photoService.findPhotoByUsername(username);
        const filterData = photo.map((el) => ({
            theme: el.theme,
            description: el.description,
            idPhoto: el.idPhoto
        }));

        return filterData;
    }

    async getPhoto(id: string, res:Response) {
        const filename = await this.photoService.getPhotoByIdPhoto(id);
        
        if(existsSync(resolve("photo/"+filename.photo))){
            createReadStream(resolve("photo/"+filename.photo)).pipe(res);
            return;
        }

        res.sendStatus(404);
    }

    async loadMorePhoto(username: string, skip: number) {
        const data = await this.photoService.loadMorePhoto(username, skip, 4);
        
        return data.map((el) => ({ 
            idPhoto: el.idPhoto,
            theme: el.theme,
            author: el.author,
            description: el.description
        }));
    }
    // TODO -_-
    async deletePhoto(id: string, author: string){
        const deletePhoto = await this.photoService.findOneAndDelete(id, author);
        await unlink(resolve(`photo/${deletePhoto.photo}`)); 
    }

    async getCountPhoto(author: string) {
        return await this.photoService.getCountPhoto(author);
    }
}
