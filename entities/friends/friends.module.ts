import { Module } from "@nestjs/common";  
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsRepository } from "./friends.repository";
import { FriendsService } from "./friends.service";

@Module({
    imports: [TypeOrmModule.forFeature([FriendsRepository])],
    providers: [FriendsService],
    exports: [FriendsService]
})
export class FriendsEntityModule {};
