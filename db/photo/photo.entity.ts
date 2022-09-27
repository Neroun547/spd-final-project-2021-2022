import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PhotoInterface } from "./interfaces/photo.interface";

@Entity()
export class Photo implements PhotoInterface {
    @PrimaryGeneratedColumn()
    _id: number

    @Column()
    author: number

    @Column()
    theme: string

    @Column()
    description: string

    @Column()
    photo: string

    @Column()
    idPhoto: string
}