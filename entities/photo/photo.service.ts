import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IPhoto } from "./interfaces/photo.interface";
import { PhotoRepository } from "./photo.repository";

@Injectable()
export class PhotoService {
    constructor(@InjectRepository(PhotoRepository) private readonly photoRepository:PhotoRepository){};

    async savePhoto(photoData: IPhoto) {
        await this.photoRepository.save(photoData);
    }

    async findPhotoByUsername(username: string) {
        return await this.photoRepository.find({ where:{ author: username}, take: 4 });
    }

    async getPhotoByIdPhoto(idPhoto: string) {
        return await this.photoRepository.findOne({ idPhoto: idPhoto });
    }

    async loadMorePhoto(username: string, skip: number, numberPhoto: number) {
        return await this.photoRepository.find({ 
            where: { author: username }, 
            take: numberPhoto, 
            skip: skip
        });
    }

    async findOneAndDelete(idPhoto: string, author: string) {
        const data = await this.photoRepository.findOne({ where: { idPhoto: idPhoto, author: author } });       
        await this.photoRepository.delete({ idPhoto: idPhoto, author: author });

        return data;
    }

    async getCountPhoto(author: string) {
        return await this.photoRepository.count({ author: author });
    }
}
