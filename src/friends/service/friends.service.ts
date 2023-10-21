import { Injectable } from "@nestjs/common";
import { UserServiceDb } from "../../../db/user/user.service";
import { FriendsServiceDb } from "../../../db/friends/friends.service";
import {FriendPendingServiceDb} from "../../../db/friends-pending/friend-pending.service";

@Injectable()
export class FriendsService {
    constructor(
        private readonly userServiceDb: UserServiceDb,
        private readonly friendsServiceDb: FriendsServiceDb,
        private friendPendingServiceDb: FriendPendingServiceDb
    ) {};

    async getFriends(idGetter: number, count: number, skip: number) {
        return (await this.userServiceDb.getFriendsAccount(idGetter, count, skip)).map(el => ({
            idAvatar: el.idAvatar,
            username: el.username,
            _id: el._id
        }));
    }

    async getCountFriends(idGetter: number) {
        return await this.userServiceDb.getCountFriends(idGetter);
    }

    async deleteFriend(idUser: number, idFriend: number) {
        await this.friendsServiceDb.deleteFriend(idUser, idFriend);
    }

    async alreadyFriend(friendUsername: string, idUser: number) {
        const friendId = await this.userServiceDb.getIdUserByUsername(friendUsername);
        const alreadyFriend = await this.friendsServiceDb.alreadyFriends(idUser, friendId);
        const pendingFriend = await this.friendPendingServiceDb.findFriend(friendId, idUser);

        if(alreadyFriend) {
            return {
                accept: true,
                pending: false
            }
        }
        if(pendingFriend) {
            return {
                accept: false,
                pending: true
            }
        }
        return {
            accept: false,
            pending: false
        }
    }
}
