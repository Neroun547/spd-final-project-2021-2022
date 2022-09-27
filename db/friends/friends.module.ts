import { Module } from "@nestjs/common";  
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsRepository } from "./friends.repository";
import { FriendsServiceDb } from "./friends.service";

@Module({
    imports: [TypeOrmModule.forFeature([FriendsRepository])],
    providers: [FriendsServiceDb],
    exports: [FriendsServiceDb]
})
export class FriendsModuleDb {};
