import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicRepository } from "./music.repository";
import { MusicInterface } from "./interfaces/music.interface";

@Injectable()
export class MusicServiceDb {
    constructor(@InjectRepository(MusicRepository) private readonly musicsRepository:MusicRepository) {};

    async getMusics(skip: number, countMusic: number, publicateUser: number) {
        return await this.musicsRepository.find({ 
            where: { publicateUser: publicateUser  }, 
            take: countMusic, 
            skip: skip,
            order: { _id: "DESC" }
        });
    }

    async saveMusic(music: MusicInterface) {
        await this.musicsRepository.save(music);
    }

    async getCountMusics(publicateUser: number) {
        return await this.musicsRepository.count({ where: { publicateUser: publicateUser } });
    }

    async deleteMusic(idMusic: string, publicateUser: number) {
        const deleteItem = await this.musicsRepository.findOne({ where: { idMusic: idMusic.trim(), publicateUser: publicateUser } });
        await this.musicsRepository.delete({ idMusic: idMusic, publicateUser: publicateUser });

        return deleteItem;
    }

    async getMusicById(idMusic: string) {
        return await this.musicsRepository.findOne({ idMusic: idMusic });
    }

    async getAllMusicByPublicateUser(publicateUser: number) {
        return await this.musicsRepository.find({ publicateUser: publicateUser });
    }

    async deleteAllMusicByPublicateUser(publicateUser: number) {
        await this.musicsRepository.delete({ publicateUser: publicateUser });
    }
}