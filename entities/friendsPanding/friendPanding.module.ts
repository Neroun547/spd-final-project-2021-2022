import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendPandingRepository } from "./friendPanding.repository";
import { FriendPandingService } from "./friendPanding.service";

@Module({
    imports: [TypeOrmModule.forFeature([FriendPandingRepository])],
    providers: [FriendPandingService],
    exports: [FriendPandingService]
})
export class FriendPandingEntityModule {};
