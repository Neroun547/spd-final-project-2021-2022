import { BadRequestException, Injectable } from "@nestjs/common";  
import { FriendPandingService } from "entities/friendsPanding/friendPanding.service";
import { FriendsService } from "../../../entities/friends/friends.service";
import { UserService } from "../../../entities/user/user.service";

@Injectable()
export class AddFriendService {
    constructor(
        private readonly friendPandingService: FriendPandingService,
        private readonly friendService: FriendsService,
        private readonly userService: UserService) { };

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

        await this.friendPandingService.deletePanding(idGetter, idSender);
        await this.friendService.acceptInvite(idGetter, idSender);        
    }

    async countInvites(idGetter: number) {
        return this.friendPandingService.countInvites(idGetter);
    }
}
