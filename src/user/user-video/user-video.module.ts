import { Module } from "@nestjs/common";
import { UserModuleDb } from "../../../db/user/user.module";
import { VideoModuleDb } from "../../../db/video/video.module";
import { UserVideoService } from "./service/user-video.service";
import { UserVideoController } from "./user-video.controller";
import {CommonModule} from "../../../common/common.module";
import {FriendsModule} from "../../friends/friends.module";

@Module({
    imports:[
        UserModuleDb,
        VideoModuleDb,
        CommonModule,
        FriendsModule
    ],
    controllers: [UserVideoController],
    providers: [UserVideoService]
})
export class UserVideoModule {}
