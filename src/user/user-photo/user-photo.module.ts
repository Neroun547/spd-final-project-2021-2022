import { Module } from "@nestjs/common";
import { PhotoModuleDb } from "../../../db/photo/photo.module";
import { UserModuleDb } from "../../../db/user/user.module";
import { UserPhotoService } from "./service/user-photo.service";
import { UserPhotoController } from "./user-photo.controller";
import {CommonModule} from "../../../common/common.module";
import {FriendsModule} from "../../friends/friends.module";

@Module({
    imports:[
        PhotoModuleDb,
        UserModuleDb,
        FriendsModule,
        CommonModule
    ],
    controllers: [UserPhotoController],
    providers: [UserPhotoService]
})
export class UserPhotoModule {};
