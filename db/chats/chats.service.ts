import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatsRepository } from "./chats.repository";

@Injectable()
export class ChatsServiceDb {
    constructor(@InjectRepository(ChatsRepository) private readonly chatsRepository: ChatsRepository){}

    async existChat(sender: number, getter: number) {
        const chat = await this.chatsRepository.findOne({ sender, getter });

        return chat ? true : false;
    }

    async createChat(sender: number, getter: number, idChat: string) {
        await this.chatsRepository.save({ sender, getter, idChat});
    }

    async getAllChats(sender: number) {
        return await this.chatsRepository.find({ sender });
    }

    async getChatIdBySender(sender: number) {
        return (await this.chatsRepository.findOne({sender})).idChat;
    }

    async getChatIdBySenderAndGetter(sender: number, getter: number) {
        return (await this.chatsRepository.findOne({sender, getter})).idChat;
    }
}
