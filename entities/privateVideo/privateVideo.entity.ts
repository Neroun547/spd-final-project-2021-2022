import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IPrivateVideo } from "./interfaces/privateVideo.interface";

@Entity()
export class privateVideoEntity implements IPrivateVideo {
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