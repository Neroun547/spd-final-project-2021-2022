import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendPendingServiceDb } from "./friend-pending.service";
import {FriendPendingRepository} from "./friend-pending.repository";

@Module({
    imports: [TypeOrmModule.forFeature([FriendPendingRepository])],
    providers: [FriendPendingServiceDb],
    exports: [FriendPendingServiceDb]
})
export class FriendPendingModuleDb {}
