import { Module } from "@nestjs/common";
import { ChatSocketService } from "./service/chat-socket.service";
import { ChatController } from "./chat.controller"; 
import { UserModuleDb } from "../../db/user/user.module";
import { ChatService } from "./service/chat.service";
import { ChatsModuleDb } from "../../db/chats/chats.module";
import { MessagesModuleDb } from "../../db/messages/messages.module";

@Module({
    imports:[UserModuleDb, ChatsModuleDb, MessagesModuleDb],
    controllers: [ChatController],
    providers: [ChatSocketService, ChatService]
})
export class ChatModule {};
