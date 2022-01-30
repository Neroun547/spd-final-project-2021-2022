import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IFriends } from "./interfaces/friends.interface";

@Entity()
export class Friends implements IFriends {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    user: number;

    @Column()
    friend: number;
}