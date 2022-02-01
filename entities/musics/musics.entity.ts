import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IMusics } from "./interfaces/musics.interface";

@Entity()
export class Music implements IMusics {
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
    publicateUser: string;
}