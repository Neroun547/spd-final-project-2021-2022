import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";  
import { ChatsInterface } from "./interfaces/chats.interface";

@Entity()
export class Chats implements ChatsInterface {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    sender: number;

    @Column()
    getter: number;

    @Column()
    idChat: string;
} 
