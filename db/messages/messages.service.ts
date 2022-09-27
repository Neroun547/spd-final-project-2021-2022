import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesServiceDb {
    constructor(@InjectRepository(MessagesRepository) private readonly messagesRepository: MessagesRepository){}
    
    async getMessages(sender: number, getter: number, count: number, skip: number) {
        return await this.messagesRepository.find({
            where: [ 
                {sender: sender, getter: getter},
                {sender: getter, getter: sender} 
            ], take: count, skip: skip, order: { _id:-1 }
        }); 
    }

    async saveMessage(sender: number, getter: number, message: string, idChat: string, idMessage: string) {
        return await this.messagesRepository.save({ sender, getter, idChat, message, idMessage });
    }

    async countMessages(sender: number, getter: number) {
        return await this.messagesRepository.count({ 
            where: [
                {sender: sender, getter: getter},
                {sender: getter, getter: sender}
            ]
        });
    }

    async deleteMessage(idMessage: string, sender: number) {
        await this.messagesRepository.delete({ idMessage: idMessage, sender: sender });
    }
}
