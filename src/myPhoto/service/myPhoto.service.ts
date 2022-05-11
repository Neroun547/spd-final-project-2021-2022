import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PhotoService } from "../../../entities/photo/photo.service";
import { v4 as uuidv4 } from 'uuid';
import { resolve } from "path";
import { unlink } from "fs/promises";
import { UploadPhoto } from "../interfaces/upload-photo.interface";
import { existsSync } from "fs";

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
    async deletePhoto(id: string, author: number){
        const deletePhoto = await this.photoService.findOneAndDelete(id, author);

        if(existsSync(resolve(`photo/${deletePhoto.photo}`))) {
            await unlink(resolve(`photo/${deletePhoto.photo}`)); 

            return;
        }

        throw new NotFoundException();
    }

    async getCountPhoto(author: number) {
        return await this.photoService.getCountPhoto(author);
    }
}
