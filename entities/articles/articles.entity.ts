import { IArticle } from "./interfaces/articles.interface";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"; 

@Entity()
export class Articles implements IArticle {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ nullable: false })
    article: string

    @Column({ nullable: false })
    idArticle: string;

    @Column({ nullable: false })
    theme: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    publicateUser: number;

    @Column({ nullable: false })
    date: Date;
}
