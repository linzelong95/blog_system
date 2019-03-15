import { Entity, PrimaryGeneratedColumn, Column,CreateDateColumn,ManyToOne,JoinColumn} from "typeorm";
import {User} from "./User";
import {Article} from "./Article"

@Entity()
export class Reply {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reply: string;

    @Column()
    isApproved: number;

    @Column()
    isTop: number;

    @Column()
    parentId: number;

    @CreateDateColumn()
    createDate: string;

    @ManyToOne(type => User, user => user.replies)
    user: User;

    @ManyToOne(type => User, user => user.toIds)
    @JoinColumn({name:"toId"})
    toId:User;


    @ManyToOne(type=>Article,article=>article.replies)
    article:Article;

}