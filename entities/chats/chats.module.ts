import { Module } from "@nestjs/common";
import { ChatsService } from "./chats.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatsRepository } from "./chats.repository";

@Module({
    imports: [TypeOrmModule.forFeature([ChatsRepository])],
    providers: [ChatsService],
    exports: [ChatsService]
})
export class ChatsEntityModule {};
