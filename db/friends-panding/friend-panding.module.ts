import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendPendingServiceDb } from "./friend-panding.service";
import {FriendPendingRepository} from "./friend-panding.repository";

@Module({
    imports: [TypeOrmModule.forFeature([FriendPendingRepository])],
    providers: [FriendPendingServiceDb],
    exports: [FriendPendingServiceDb]
})
export class FriendPandingEntityModule {};
