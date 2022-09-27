import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MessagesInterface } from "./interfaces/messages.interface";

@Entity()
export class Messages implements MessagesInterface {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    sender: number;

    @Column()
    getter: number;

    @Column()
    idChat: string;

    @Column()
    message: string;

    @Column() 
    idMessage: string;
}
