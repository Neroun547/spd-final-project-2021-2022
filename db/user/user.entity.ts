import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserInterface } from "./interfaces/user.interface";

@Entity()
export class User implements UserInterface  {
    @PrimaryGeneratedColumn()
    _id:number;

    @Column()
    name:string;

    @Column({ unique:true })
    username:string;

    @Column({ unique:true })
    email:string;

    @Column()
    password:string;
    
    @Column({ default:"" })
    avatar:string

    @Column({ default:"" })
    idAvatar:string
}