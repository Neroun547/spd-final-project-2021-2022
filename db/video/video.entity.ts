import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"; 
import { VideoInterface } from "./interfaces/video.interface";

@Entity()
export class Video implements VideoInterface {
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
