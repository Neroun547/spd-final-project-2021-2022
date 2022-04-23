import { Module } from "@nestjs/common";
import { UserArticlesService } from "./service/user-articles.service";  
import { UserArticlesController } from "./user-articles.controller";
import { ArticlesEntityModule } from "entities/articles/articles.module";  
import { UserEntityModule } from "entities/user/user.module";
import { FriendPandingEntityModule } from "entities/friendsPanding/friendPanding.module";
import { FriendsEntityModule } from "entities/friends/friends.module";

@Module({
    imports: [ArticlesEntityModule, UserEntityModule, FriendPandingEntityModule, FriendsEntityModule],
    controllers: [UserArticlesController],
    providers: [UserArticlesService]
})
export class UserArticlesModule {};

