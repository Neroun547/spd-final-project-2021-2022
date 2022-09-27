import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendsRepository } from "./friends.repository";

@Injectable()
export class FriendsServiceDb {
    constructor(@InjectRepository(FriendsRepository) private readonly friendsRepository: FriendsRepository ) {};

    async alreadyFriends(idUser: number, idFriend: number) {
        return await this.friendsRepository.findOne({ user: idUser, friend: idFriend });
    }

    async acceptInvite(idUser: number, idFriend: number) {  
        await this.friendsRepository.save({ user: idUser, friend: idFriend });
        await this.friendsRepository.save({ user: idFriend, friend: idUser });
    }

    async deleteFriend(idUser: number, idFriend: number) {
        await this.friendsRepository.delete({ user: idUser, friend: idFriend });
        await this.friendsRepository.delete({ user: idFriend, friend: idUser });
    }

    async getAllFriends(idUser: number) {
        return await this.friendsRepository.find({ user: idUser });
    }
}
