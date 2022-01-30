import { Column, Entity,  JoinColumn,  OneToOne,  PrimaryGeneratedColumn } from "typeorm"; 
import { IFriendPanding } from "./interfaces/IFriendPanding";
import { User } from "../user/user.entity";

@Entity()
export class FriendPanding implements IFriendPanding {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    idSender: number;

    @Column()
    idGetter: number;
} 
