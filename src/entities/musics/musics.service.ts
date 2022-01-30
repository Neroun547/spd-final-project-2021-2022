import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicsRepository } from "./musics.repository";
import { IMusics } from "./interfaces/musics.interface";

@Injectable()
export class MusicsService {
    constructor(@InjectRepository(MusicsRepository) private readonly musicsRepository:MusicsRepository) {};

    async getMusics(skip: number, countMusic: number, publicateUser: string) {
        return await this.musicsRepository.find({ 
            where: { publicateUser: publicateUser  }, 
            take: countMusic, 
            skip: skip
        });
    }

    async saveMusic(music:IMusics) {
        await this.musicsRepository.save(music);
    }

    async getCountMusics(publicateUser: string) {
        return await this.musicsRepository.count({ where: { publicateUser: publicateUser } });
    }

    async deleteMusic(idMusic: string, publicateUser: string) {
        const deleteItem = await this.musicsRepository.findOne({ where: { idMusic: idMusic.trim(), publicateUser: publicateUser } });
        await this.musicsRepository.delete({ idMusic: idMusic, publicateUser: publicateUser });

        return deleteItem;
    }

    async getMusicsById(idMusic: string) {
        return await this.musicsRepository.findOne({ idMusic: idMusic });
    }
}