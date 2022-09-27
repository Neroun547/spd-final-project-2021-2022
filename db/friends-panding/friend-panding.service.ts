import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendPendingRepository } from "./friend-panding.repository";

Injectable()
export class FriendPendingServiceDb {
    constructor(@InjectRepository(FriendPendingRepository) private readonly friendRepository: FriendPendingRepository) {};

    async addFriend(idGetter: number, idSender: number) {
        const sameFriend = await this.friendRepository.findOne({ idGetter, idSender });

        if(sameFriend){
            throw new BadRequestException();
        }

        await this.friendRepository.save({ idGetter, idSender});
    }

    async findFriend(idGetter: number, idSender: number) {
        return await this.friendRepository.findOne({ idGetter, idSender });
    }

    async deletePanding(idGetter: number, idSender) {
        await this.friendRepository.delete({ idGetter, idSender });
    }

    async countInvites(idGetter: number) {
        return await this.friendRepository.count({ idGetter });
    }
}
