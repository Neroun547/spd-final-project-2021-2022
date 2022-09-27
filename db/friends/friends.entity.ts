import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FriendsInterface } from "./interfaces/friends.interface";

@Entity()
export class Friends implements FriendsInterface {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    user: number;

    @Column()
    friend: number;
}