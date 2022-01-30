import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";  
import { IChats } from "./interfaces/IChats";

@Entity()
export class Chats implements IChats {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    sender: number;

    @Column()
    getter: number;

    @Column()
    idChat: string;
} 
