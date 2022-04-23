import { Module } from "@nestjs/common"; 
import { UserEntityModule } from "../../entities/user/user.module";
import { PhotoEntityModule } from "../../entities/photo/photo.module";
import { MusicsEntityModule } from "../../entities/musics/musics.module";
import { VideoEntityModule } from "../../entities/video/video.module";
import { FriendPandingEntityModule } from "../../entities/friendsPanding/friendPanding.module";
import { FriendsEntityModule } from "entities/friends/friends.module";
import { ArticlesEntityModule } from "entities/articles/articles.module";
import { UserArticlesModule } from "./user-articles/user-articles.modules";
import { UserMusicModule } from "./user-musics/user-musics.module";
import { UserPhotoModule } from "./user-photo/user-photo.module";
import { UserVideoModule } from "./user-video/user-video.module";

@Module({
    imports: [
        UserEntityModule, 
        PhotoEntityModule,
        MusicsEntityModule,
        VideoEntityModule,
        FriendPandingEntityModule,
        FriendsEntityModule,
        ArticlesEntityModule,
        UserArticlesModule,
        UserMusicModule,
        UserPhotoModule,
        UserVideoModule
    ]
})
export class UserModule {};
