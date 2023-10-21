import { Module } from "@nestjs/common";
import { AddFriendController } from "./add-friend.controller";
import { AddFriendService } from "./service/add-friend.service";
import { FriendsModuleDb } from "../../db/friends/friends.module";
import { UserModuleDb } from "../../db/user/user.module";
import {FriendPendingModuleDb} from "../../db/friends-pending/friend-pending.module";

@Module({
    imports: [FriendsModuleDb, UserModuleDb, FriendPendingModuleDb],
    controllers: [AddFriendController],
    providers: [AddFriendService]
})
export class AddFriendModule {};
