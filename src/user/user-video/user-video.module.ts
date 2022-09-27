import { Module } from "@nestjs/common";
import { FriendsModuleDb } from "db/friends/friends.module";
import { FriendPandingEntityModule } from "db/friends-panding/friend-panding.module";
import { UserModuleDb } from "db/user/user.module";
import { VideoModuleDb } from "db/video/video.module";
import { UserVideoService } from "./service/user-video.service";
import { UserVideoController } from "./user-video.controller";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports:[
        FriendPandingEntityModule, 
        FriendsModuleDb,
        UserModuleDb,
        VideoModuleDb,
        JwtModule
    ],
    controllers: [UserVideoController],
    providers: [UserVideoService]
})
export class UserVideoModule {};
