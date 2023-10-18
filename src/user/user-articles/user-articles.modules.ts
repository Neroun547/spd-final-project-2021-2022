import { Module } from "@nestjs/common";
import { UserArticlesService } from "./service/user-articles.service";
import { UserArticlesController } from "./user-articles.controller";
import { ArticlesModuleDb } from "db/articles/articles.module";
import { UserModuleDb } from "db/user/user.module";
import { FriendPandingEntityModule } from "db/friends-panding/friend-panding.module";
import { FriendsModuleDb } from "db/friends/friends.module";
import {JwtModule} from "@nestjs/jwt";
import {CommonModule} from "../../../common/common.module";

@Module({
    imports: [
        ArticlesModuleDb,
        UserModuleDb,
        FriendPandingEntityModule,
        FriendsModuleDb,
        JwtModule,
        CommonModule
    ],
    controllers: [UserArticlesController],
    providers: [UserArticlesService]
})
export class UserArticlesModule {};

