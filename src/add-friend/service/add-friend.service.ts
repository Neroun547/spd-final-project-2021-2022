import { BadRequestException, Injectable } from "@nestjs/common";
import { FriendPendingServiceDb } from "db/friends-pending/friend-pending.service";
import { FriendsServiceDb } from "../../../db/friends/friends.service";
import { UserServiceDb } from "../../../db/user/user.service";

@Injectable()
export class AddFriendService {
    constructor(
        private readonly friendPendingService: FriendPendingServiceDb,
        private readonly friendService: FriendsServiceDb,
        private readonly userService: UserServiceDb) { };

    async getFriendInvites(id: number, count: number, skip: number) {
        return (await this.userService.getFriendsInviteAccount(id, count, skip)).filter(el => ({
            idAvatar: el.idAvatar,
            username: el.username
        }));
    }

    async acceptInvite(usernameGetter: string, usernameSender: string) {
        const idGetter = await this.userService.getIdUserByUsername(usernameGetter);
        const idSender = await this.userService.getIdUserByUsername(usernameSender);
        const alreadyFriends = await this.friendService.alreadyFriends(idGetter, idSender);

        if(alreadyFriends) {
            throw new BadRequestException();
        }

        await this.friendPendingService.deletePending(idGetter, idSender);
        await this.friendService.acceptInvite(idGetter, idSender);
    }

    async countInvites(idGetter: number) {
        return this.friendPendingService.countInvites(idGetter);
    }

    async addFriendInvite(friendUsername: string, idUser: number) {
        const friendId = await this.userService.getIdUserByUsername(friendUsername);

        await this.friendPendingService.addFriend(friendId, idUser);
    }

    async deleteInvite(friendUsername: string, idUser: number) {
        const friendId = await this.userService.getIdUserByUsername(friendUsername);

        await this.friendPendingService.deletePending(idUser, friendId);
    }
}
