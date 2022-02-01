import { Module } from "@nestjs/common";
import { FriendsController } from "./friends.controller";
import { MyFriendsService } from "./service/friends.service";
import { UserEntityModule } from "../../entities/user/user.module";
import { FriendsEntityModule } from "entities/friends/friends.module";

@Module({
    imports: [UserEntityModule, FriendsEntityModule],
    controllers: [FriendsController],
    providers: [MyFriendsService]
})
export class FriendsModule {};
