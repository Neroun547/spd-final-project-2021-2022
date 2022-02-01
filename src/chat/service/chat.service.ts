import { Injectable } from "@nestjs/common";
import { UserService } from "../../../entities/user/user.service";
import { ChatsService } from "../../../entities/chats/chats.service";
import { MessagesService } from "../../../entities/messages/messages.service";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
    constructor(
        private readonly userService: UserService,
        private readonly chatsService: ChatsService,
        private readonly messagesService: MessagesService
    ) {}

    async getAllChats(sender: number) {
        return (await this.userService.getUsersChatsAccount(sender)).map(el => ({
            username: el.username,
            idAvatar: el.idAvatar
        }));
    }
    
    async createChatOrGetData(sender: number, usernameGetter: string) {
        const idGetter = await this.userService.getIdUserByUsername(usernameGetter);
        const existChatSender = await this.chatsService.existChat(sender, idGetter);
        const existChatGetter = await this.chatsService.existChat(idGetter, sender);

        if(existChatSender && existChatGetter) {
            return (await this.messagesService.getMessages(sender, idGetter, 10, 0)).map(el => ({
                _id: el._id,
                message: el.message,
                sender: el.sender === sender ? true : false,
                idMessage: el.idMessage
            }));
        }

        if(existChatSender && !existChatGetter) {
            return;
        }

        if(!existChatSender && existChatGetter) {
            const idChat = await this.chatsService.getChatIdBySenderAndGetter(idGetter, sender);
            await this.chatsService.createChat(sender, idGetter, idChat);
            return;
        }

        const idChat = uuidv4();
        await this.chatsService.createChat(sender, idGetter, idChat);
    }

    async chatMessagesUser(sender: number, usernameGetter: string, count: number, skip: number) {
        const idGetter = await this.userService.getIdUserByUsername(usernameGetter);
        return (await this.messagesService.getMessages(sender, idGetter, count, skip)).map(el => ({
            _id: el._id,
            message: el.message,
            sender: el.sender === sender ? true : false,
            idMessage: el.idMessage
        }));
    }
    
    async countMessage(sender: number, usernameGetter: string) {
        const idGetter = await this.userService.getIdUserByUsername(usernameGetter);

        return await this.messagesService.countMessages(sender, idGetter);
    }
}
