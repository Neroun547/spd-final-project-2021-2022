import { Module } from "@nestjs/common"; 
import { UserModuleDb } from "../../db/user/user.module";
import { PhotoModuleDb } from "../../db/photo/photo.module";
import { MusicsModuleDb } from "../../db/musics/musics.module";
import { VideoModuleDb } from "../../db/video/video.module";
import { FriendPandingEntityModule } from "../../db/friends-panding/friend-panding.module";
import { FriendsModuleDb } from "db/friends/friends.module";
import { ArticlesModuleDb } from "db/articles/articles.module";
import { UserArticlesModule } from "./user-articles/user-articles.modules";
import { UserMusicModule } from "./user-musics/user-musics.module";
import { UserPhotoModule } from "./user-photo/user-photo.module";
import { UserVideoModule } from "./user-video/user-video.module";

@Module({
    imports: [
        UserModuleDb,
        PhotoModuleDb,
        MusicsModuleDb,
        VideoModuleDb,
        FriendPandingEntityModule,
        FriendsModuleDb,
        ArticlesModuleDb,
        UserArticlesModule,
        UserMusicModule,
        UserPhotoModule,
        UserVideoModule
    ]
})
export class UserModule {};
