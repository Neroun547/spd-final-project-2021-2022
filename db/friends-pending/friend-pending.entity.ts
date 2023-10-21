import { Column, Entity,  PrimaryGeneratedColumn } from "typeorm";
import { FriendPendingInterface } from "./interfaces/friend-pending.interface";

@Entity()
export class FriendPending implements FriendPendingInterface {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    idSender: number;

    @Column()
    idGetter: number;
}
