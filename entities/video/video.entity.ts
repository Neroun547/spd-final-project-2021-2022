import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"; 
import { IVideo } from "./interfaces/IVideo";

@Entity()
export class Video implements IVideo {
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
