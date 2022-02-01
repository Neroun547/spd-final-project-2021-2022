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

    async findPhotoById(publicateUser: string) {
        return await this.photoRepository.find({ where:{ author: publicateUser}, take: 4 });
    }

    async getPhotoByIdPhoto(idPhoto: string) {
        return await this.photoRepository.findOne({ idPhoto: idPhoto });
    }

    async loadMorePhoto(publicateUser: string, skip: number, numberPhoto: number) {
        return await this.photoRepository.find({ 
            where: { author: publicateUser }, 
            take: numberPhoto, 
            skip: skip
        });
    }

    async findOneAndDelete(idPhoto: string, publicateUser: string) {
        const data = await this.photoRepository.findOne({ where: { idPhoto: idPhoto, author: publicateUser } });       
        await this.photoRepository.delete({ idPhoto: idPhoto, author: publicateUser });

        return data;
    }

    async getCountPhoto(publicateUser: string) {
        return await this.photoRepository.count({ author: publicateUser });
    }
}
