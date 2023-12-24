import { Module } from "@nestjs/common";
import { MusicsModuleDb } from "../../../db/musics/music.module";
import { UserModuleDb } from "../../../db/user/user.module";
import { UserMusicsService } from "./service/user-musics.service";
import { UserMusicsController } from "./user-musics.controller";
import {JwtModule} from "@nestjs/jwt";
import {CommonModule} from "../../../common/common.module";
import {FriendsModule} from "../../friends/friends.module";

@Module({
    imports: [
        MusicsModuleDb,
        UserModuleDb,
        JwtModule,
        CommonModule,
        FriendsModule
    ],
    controllers: [UserMusicsController],
    providers: [UserMusicsService]
})
export class UserMusicModule {};
