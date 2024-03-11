import { ArticlesInterface } from "./interfaces/articles.interface";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";

@Entity()
export class Articles implements ArticlesInterface {
    @PrimaryGeneratedColumn()
    _id: number;

    @Column({ nullable: false })
    article: string

    @Column({ nullable: false })
    id_article: string;

    @Column({ nullable: false })
    theme: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    user_id: number;

    @Column({ nullable: false })
    date: Date;


    @ManyToOne(() => User,  (user) => user.articles)
    user: User;
}
