import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Article } from "./Article";
import { Reply } from "./Reply";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    account: string;

    @Column()
    password: string;

    @Column()
    roleName: string;

    @Column()
    nickName: string;

    @OneToMany(type => Article, article => article.user)
    articles: Article[];

    @OneToMany(type => Reply, reply => reply.from)
    froms: Reply[];

    @OneToMany(type => Reply, reply => reply.to)
    tos: Reply[];

}