import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VideoRepository } from "./video.repository";
import { IInfoVideo } from "./interfaces/IInfoVideo"; 

@Injectable()
export class VideoService {
    constructor(@InjectRepository(VideoRepository) private readonly videoRepository: VideoRepository) {};

    async saveVideo(infoVideo: IInfoVideo) {
        await this.videoRepository.save(infoVideo);
    }

    async getVideo(publicateUser: number, countVideo: number, skip:number) {
        return await this.videoRepository.find({ where: { publicateUser: publicateUser }, take: countVideo, skip: skip, order: {_id: "DESC"} });
    }

    async getVideoById(id: string) {
        return await this.videoRepository.findOne({ idVideo: id });
    }

    async deleteVideo(id: string, publicateUser: number) {
        const video = await this.videoRepository.findOne({ where: { idVideo: id, publicateUser: publicateUser } });
        await this.videoRepository.delete({ idVideo: id, publicateUser: publicateUser });

        return video;
    }

    async getCountVideo(publicateUser: number) {
        return await this.videoRepository.count({ where: { publicateUser: publicateUser } });
    }

    async updateParamsVideo(publicateUser: number, name: string, description: string, idVideo: string) {
        await this.videoRepository.update({ idVideo, publicateUser }, { name, description });
    }
}
