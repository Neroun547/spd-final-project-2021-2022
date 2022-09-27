import { Injectable } from "@nestjs/common";
import { UserServiceDb } from "../../../db/user/user.service";
import { ChatsServiceDb } from "../../../db/chats/chats.service";
import { MessagesServiceDb } from "../../../db/messages/messages.service";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
    constructor(
        private readonly userService: UserServiceDb,
        private readonly chatsService: ChatsServiceDb,
        private readonly messagesService: MessagesServiceDb
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
