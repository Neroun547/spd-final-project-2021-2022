import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PhotoInterface } from "./interfaces/photo.interface";
import { PhotoRepository } from "./photo.repository";

@Injectable()
export class PhotoServiceDb {
    constructor(@InjectRepository(PhotoRepository) private readonly photoRepository:PhotoRepository){};

    async savePhoto(photoData: PhotoInterface) {
        await this.photoRepository.save(photoData);
    }

    async findPhotoById(publicateUser: number, skip: number, take: number) {
        return await this.photoRepository.find({ where:{ author: publicateUser}, take: take, skip: skip, order: {_id: "DESC"} });
    }

    async getPhotoByIdPhoto(idPhoto: string) {
        return await this.photoRepository.findOne({ idPhoto: idPhoto });
    }

    async findOneAndDelete(idPhoto: string, publicateUser: number) {
        const data = await this.photoRepository.findOne({ where: { idPhoto: idPhoto, author: publicateUser } });       
        await this.photoRepository.delete({ idPhoto: idPhoto, author: publicateUser });

        return data;
    }

    async getCountPhoto(publicateUser: number) {
        return await this.photoRepository.count({ author: publicateUser });
    }
}
