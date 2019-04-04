import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Article } from "./Article";
import { Reply } from "./Reply";


export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    account: string;

    @Column({ select: false })
    password: string;

    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    roleName: UserRole;

    @Column()
    nickName: string;

    @OneToMany(type => Article, article => article.user)
    articles: Article[];

    @OneToMany(type => Reply, reply => reply.from)
    froms: Reply[];

    @OneToMany(type => Reply, reply => reply.to)
    tos: Reply[];

}