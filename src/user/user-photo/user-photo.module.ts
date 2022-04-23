import { Module } from "@nestjs/common";
import { FriendsEntityModule } from "entities/friends/friends.module";
import { FriendPandingEntityModule } from "entities/friendsPanding/friendPanding.module";
import { PhotoEntityModule } from "entities/photo/photo.module";
import { UserEntityModule } from "entities/user/user.module";
import { UserPhotoService } from "./service/user-photo.service";
import { UserPhotoController } from "./user-photo.controller"; 

@Module({
    imports:[
        PhotoEntityModule,
        UserEntityModule,
        FriendPandingEntityModule,
        FriendsEntityModule
    ],
    controllers: [UserPhotoController],
    providers: [UserPhotoService]
})
export class UserPhotoModule {};
