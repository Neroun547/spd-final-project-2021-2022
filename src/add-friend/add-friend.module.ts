import { Module } from "@nestjs/common";
import { AddFriendController } from "./add-friend.controller"; 
import { AddFriendService } from "./service/add-friend.service"; 
import { FriendsModuleDb } from "../../db/friends/friends.module";
import { FriendPandingEntityModule } from "db/friends-panding/friend-panding.module";
import { UserModuleDb } from "../../db/user/user.module";

@Module({
    imports: [FriendsModuleDb, UserModuleDb, FriendPandingEntityModule],
    controllers: [AddFriendController],
    providers: [AddFriendService]
})
export class AddFriendModule {};
