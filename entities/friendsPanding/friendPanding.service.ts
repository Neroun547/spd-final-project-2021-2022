import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendPandingRepository } from "./friendPanding.repository"; 

Injectable()
export class FriendPandingService {
    constructor(@InjectRepository(FriendPandingRepository) private readonly friendRepositore: FriendPandingRepository) {};

    async addFriend(idGetter: number, idSender: number) {
        const sameFriend = await this.friendRepositore.findOne({ idGetter, idSender });

        if(sameFriend){
            throw new BadRequestException();
        }

        await this.friendRepositore.save({ idGetter, idSender});
    }

    async findFriend(idGetter: number, idSender: number) {
        return await this.friendRepositore.findOne({ idGetter, idSender });
    }

    async deletePanding(idGetter: number, idSender) {
        await this.friendRepositore.delete({ idGetter, idSender });
    }

    async countInvites(idGetter: number) {
        return await this.friendRepositore.count({ idGetter });
    }
}
