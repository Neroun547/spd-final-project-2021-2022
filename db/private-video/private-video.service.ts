import { Injectable } from "@nestjs/common";
import { InfoPrivateVideoInterface } from "./interfaces/info-private-video.interface";
import { PrivateVideoRepository } from "./private-video.repository";

@Injectable()
export class PrivateVideoServiceDb {
    constructor(private readonly privateVideoRepository: PrivateVideoRepository){};

    async savePrivateVideo(infoVideo: InfoPrivateVideoInterface) {
        await this.privateVideoRepository.save(infoVideo);
    }

    async getPrivateVideo(publicateUser: number, countVideo: number, skip:number) {
        return await this.privateVideoRepository.find({ where: { publicateUser: publicateUser }, take: countVideo, skip: skip, order: {  _id: "DESC"} });
    }

    async getPrivateVideoById(id: string) {
        return await this.privateVideoRepository.findOne({ idVideo: id });
    }

    async deletePrivateVideo(id: string, publicateUser: number) {
        const video = await this.privateVideoRepository.findOne({ where: { idVideo: id, publicateUser: publicateUser } });
        await this.privateVideoRepository.delete({ idVideo: id, publicateUser: publicateUser });

        return video;
    }

    async getCountPrivateVideo(publicateUser: number) {
        return await this.privateVideoRepository.count({ where: { publicateUser: publicateUser } });
    }

    async updateParamsPrivateVideo(publicateUser: number, name: string, description: string, idVideo: string) {
        await this.privateVideoRepository.update({ idVideo, publicateUser }, { name, description });
    }
}
