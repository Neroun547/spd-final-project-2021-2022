import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MusicsInterface } from "./interfaces/musics.interface";

@Entity()
export class Music implements MusicsInterface {
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