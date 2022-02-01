import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IPhoto } from "./interfaces/photo.interface";

@Entity()
export class Photo implements IPhoto {
    @PrimaryGeneratedColumn()
    _id: number

    @Column()
    author: string

    @Column()
    theme: string

    @Column()
    description: string

    @Column()
    photo: string

    @Column()
    idPhoto: string
}