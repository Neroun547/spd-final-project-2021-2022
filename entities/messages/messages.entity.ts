import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IMessages } from "./interfaces/IMessages.interface"; 

@Entity()
export class Messages implements IMessages {
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
