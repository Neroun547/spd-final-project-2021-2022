import { Module } from "@nestjs/common";
import { AddFriendController } from "./add-friend.controller"; 
import { AddFriendService } from "./service/add-friend.service"; 
import { FriendsEntityModule } from "../entities/friends/friends.module";
import { FriendPandingEntityModule } from "src/entities/friendsPanding/friendPanding.module";  
import { UserEntityModule } from "../entities/user/user.module";

@Module({
    imports: [FriendsEntityModule, UserEntityModule, FriendPandingEntityModule],
    controllers: [AddFriendController],
    providers: [AddFriendService]
})
export class AddFriendModule {};
