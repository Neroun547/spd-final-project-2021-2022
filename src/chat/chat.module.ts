import { Module } from "@nestjs/common";
import { ChatSocketService } from "./service/chat-socket.service";
import { ChatController } from "./chat.controller"; 
import { UserEntityModule } from "../entities/user/user.module";
import { ChatService } from "./service/chat.service";
import { ChatsEntityModule } from "../entities/chats/chats.module";
import { MessagesEntityModule } from "../entities/messages/messages.module";

@Module({
    imports:[UserEntityModule, ChatsEntityModule, MessagesEntityModule],
    controllers: [ChatController],
    providers: [ChatSocketService, ChatService]
})
export class ChatModule {};
