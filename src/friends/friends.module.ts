import { Module } from "@nestjs/common";
import { FriendsController } from "./friends.controller";
import { FriendsService } from "./service/friends.service";
import { UserModuleDb } from "../../db/user/user.module";
import { FriendsModuleDb } from "db/friends/friends.module";
import { FriendPendingModuleDb } from "../../db/friends-pending/friend-pending.module";

@Module({
    imports: [UserModuleDb, FriendsModuleDb, FriendPendingModuleDb],
    controllers: [FriendsController],
    providers: [FriendsService],
    exports: [FriendsService]
})
export class FriendsModule {};
