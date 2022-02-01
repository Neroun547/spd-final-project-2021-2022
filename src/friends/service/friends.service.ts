import { Injectable } from "@nestjs/common";
import { UserService } from "../../../entities/user/user.service";
import { FriendsService } from "../../../entities/friends/friends.service";

@Injectable()
export class MyFriendsService {
    constructor(
        private readonly userService: UserService,
        private readonly friendsService: FriendsService    
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
