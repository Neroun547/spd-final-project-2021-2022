import { Injectable } from "@nestjs/common";
import { UserServiceDb } from "../../../db/user/user.service";
import { FriendsServiceDb } from "../../../db/friends/friends.service";

@Injectable()
export class MyFriendsService {
    constructor(
        private readonly userService: UserServiceDb,
        private readonly friendsService: FriendsServiceDb,
    ) {};

    async getFriends(idGetter: number, count: number, skip: number) {
        return (await this.userService.getFriendsAccount(idGetter, count, skip)).map(el => ({
            idAvatar: el.idAvatar,
            username: el.username,
            _id: el._id
        }));
    }

    async getCountFriends(idGetter: number) {
        return await this.userService.getCountFriends(idGetter);
    }

    async deleteFriend(idUser: number, idFriend: number) {
        await this.friendsService.deleteFriend(idUser, idFriend);
    }
};
