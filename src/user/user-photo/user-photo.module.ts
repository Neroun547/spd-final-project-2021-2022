import { Module } from "@nestjs/common";
import { FriendsModuleDb } from "db/friends/friends.module";
import { FriendPandingEntityModule } from "db/friends-panding/friend-panding.module";
import { PhotoModuleDb } from "db/photo/photo.module";
import { UserModuleDb } from "db/user/user.module";
import { UserPhotoService } from "./service/user-photo.service";
import { UserPhotoController } from "./user-photo.controller";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports:[
        JwtModule,
        PhotoModuleDb,
        UserModuleDb,
        FriendPandingEntityModule,
        FriendsModuleDb
    ],
    controllers: [UserPhotoController],
    providers: [UserPhotoService]
})
export class UserPhotoModule {};
