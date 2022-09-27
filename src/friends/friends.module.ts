import { Module } from "@nestjs/common";
import { FriendsController } from "./friends.controller";
import { MyFriendsService } from "./service/friends.service";
import { UserModuleDb } from "../../db/user/user.module";
import { FriendsModuleDb } from "db/friends/friends.module";

@Module({
    imports: [UserModuleDb, FriendsModuleDb],
    controllers: [FriendsController],
    providers: [MyFriendsService]
})
export class FriendsModule {};
