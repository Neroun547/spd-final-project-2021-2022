import { Module } from "@nestjs/common";
import { UserArticlesService } from "./service/user-articles.service";
import { UserArticlesController } from "./user-articles.controller";
import { ArticlesModuleDb } from "db/articles/articles.module";
import { UserModuleDb } from "db/user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {CommonModule} from "../../../common/common.module";
import {FriendsModule} from "../../friends/friends.module";

@Module({
    imports: [
        ArticlesModuleDb,
        UserModuleDb,
        JwtModule,
        CommonModule,
        FriendsModule
    ],
    controllers: [UserArticlesController],
    providers: [UserArticlesService]
})
export class UserArticlesModule {};

