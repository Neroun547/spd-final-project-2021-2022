import { Module } from "@nestjs/common";
import { ChatsServiceDb } from "./chats.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatsRepository } from "./chats.repository";

@Module({
    imports: [TypeOrmModule.forFeature([ChatsRepository])],
    providers: [ChatsServiceDb],
    exports: [ChatsServiceDb]
})
export class ChatsModuleDb {}
