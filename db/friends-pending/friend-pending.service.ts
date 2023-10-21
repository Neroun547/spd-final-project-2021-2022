import { BadRequestException, Injectable } from "@nestjs/common";
import { FriendPendingRepository } from "./friend-pending.repository";

Injectable()
export class FriendPendingServiceDb {
    constructor(private readonly friendRepository: FriendPendingRepository) {};

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

    async deletePending(idGetter: number, idSender: number) {
        await this.friendRepository.delete({ idGetter, idSender });
    }

    async countInvites(idGetter: number) {
        return await this.friendRepository.count({ idGetter });
    }
}
