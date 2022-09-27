import { Module } from "@nestjs/common";
import { FriendsModuleDb } from "db/friends/friends.module";
import { FriendPandingEntityModule } from "db/friends-panding/friend-panding.module";
import { MusicsModuleDb } from "db/musics/musics.module";
import { UserModuleDb } from "db/user/user.module";
import { UserMusicsService } from "./service/user-musics.service";
import { UserMusicsController } from "./user-musics.controller";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        MusicsModuleDb,
        UserModuleDb,
        FriendPandingEntityModule, 
        FriendsModuleDb,
        JwtModule
    ],
    controllers: [UserMusicsController],
    providers: [UserMusicsService]
})
export class UserMusicModule {};