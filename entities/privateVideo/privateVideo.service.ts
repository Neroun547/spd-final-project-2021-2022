import { Injectable } from "@nestjs/common";
import { IInfoPrivateVideo } from "./interfaces/infoPrivateVideo.interface";
import { PrivateVideoRepository } from "./privateVideo.repository";

@Injectable()
export class PrivateVideoService {
    constructor(private readonly privateVideoRepository: PrivateVideoRepository){};

    async saveVideo(infoVideo: IInfoPrivateVideo) {
        await this.privateVideoRepository.save(infoVideo);
    }

    async getVideo(publicateUser: number, countVideo: number, skip:number) {
        return await this.privateVideoRepository.find({ where: { publicateUser: publicateUser }, take: countVideo, skip: skip });
    }

    async getVideoById(id: string) {
        return await this.privateVideoRepository.findOne({ idVideo: id });
    }

    async deleteVideo(id: string, publicateUser: number) {
        const video = await this.privateVideoRepository.findOne({ where: { idVideo: id, publicateUser: publicateUser } });
        await this.privateVideoRepository.delete({ idVideo: id, publicateUser: publicateUser });

        return video;
    }

    async getCountVideo(publicateUser: number) {
        return await this.privateVideoRepository.count({ where: { publicateUser: publicateUser } });
    }
}
