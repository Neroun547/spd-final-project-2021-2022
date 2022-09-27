import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MusicsRepository } from "./musics.repository";
import { MusicsInterface } from "./interfaces/musics.interface";

@Injectable()
export class MusicsServiceDb {
    constructor(@InjectRepository(MusicsRepository) private readonly musicsRepository:MusicsRepository) {};

    async getMusics(skip: number, countMusic: number, publicateUser: number) {
        return await this.musicsRepository.find({ 
            where: { publicateUser: publicateUser  }, 
            take: countMusic, 
            skip: skip,
            order: { _id: "DESC" }
        });
    }

    async saveMusic(music: MusicsInterface) {
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

    async getMusicsById(idMusic: string) {
        return await this.musicsRepository.findOne({ idMusic: idMusic });
    }
}