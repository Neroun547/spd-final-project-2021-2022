import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MusicInterface } from "./interfaces/music.interface";

@Entity()
export class Music implements MusicInterface {
    constructor(){}

    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    idMusic: string;

    @Column()
    music: string;

    @Column()
    name: string;

    @Column()
    author: string;

    @Column()
    publicateUser: number;
}