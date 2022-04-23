import { Module } from "@nestjs/common";
import { FriendsEntityModule } from "entities/friends/friends.module";
import { FriendPandingEntityModule } from "entities/friendsPanding/friendPanding.module";
import { MusicsEntityModule } from "entities/musics/musics.module";
import { UserEntityModule } from "entities/user/user.module";
import { UserMusicsService } from "./service/user-musics.service";
import { UserMusicsController } from "./user-musics.controller";

@Module({
    imports: [
        MusicsEntityModule, 
        UserEntityModule,
        FriendPandingEntityModule, 
        FriendsEntityModule
    ],
    controllers: [UserMusicsController],
    providers: [UserMusicsService]
})
export class UserMusicModule {};