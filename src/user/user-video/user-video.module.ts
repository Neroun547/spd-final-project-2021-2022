import { Module } from "@nestjs/common";
import { FriendsEntityModule } from "entities/friends/friends.module";
import { FriendPandingEntityModule } from "entities/friendsPanding/friendPanding.module";
import { UserEntityModule } from "entities/user/user.module";
import { VideoEntityModule } from "entities/video/video.module";
import { UserVideoService } from "./service/user-video.service";
import { UserVideoController } from "./user-video.controller";

@Module({
    imports:[
        FriendPandingEntityModule, 
        FriendsEntityModule,
        UserEntityModule,
        VideoEntityModule
    ],
    controllers: [UserVideoController],
    providers: [UserVideoService]
})
export class UserVideoModule {};
