import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PrivateVideoInterface } from "./interfaces/private-video.interface";

@Entity()
export class PrivateVideo implements PrivateVideoInterface {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    name: string;

    @Column()
    idVideo: string;

    @Column()
    video: string;

    @Column()
    description: string;

    @Column() 
    publicateUser: number;
}