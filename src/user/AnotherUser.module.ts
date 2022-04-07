import { Module } from "@nestjs/common";
import { UserController } from "./AnotherUser.controller";
import { AnotherUserService } from "./service/AnotherUser.service"; 
import { UserEntityModule } from "../../entities/user/user.module";
import { PhotoEntityModule } from "../../entities/photo/photo.module";
import { MusicsEntityModule } from "../../entities/musics/musics.module";
import { VideoEntityModule } from "../../entities/video/video.module";
import { FriendPandingEntityModule } from "../../entities/friendsPanding/friendPanding.module";
import { FriendsEntityModule } from "entities/friends/friends.module";
import { ArticlesEntityModule } from "entities/articles/articles.module";

@Module({
    imports: [UserEntityModule, PhotoEntityModule, MusicsEntityModule, VideoEntityModule, FriendPandingEntityModule, FriendsEntityModule, ArticlesEntityModule],
    controllers: [UserController],
    providers: [AnotherUserService]
})
export class UserModule {};
