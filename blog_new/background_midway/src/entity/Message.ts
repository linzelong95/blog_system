import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column({ default: 0 })
    isApproved: number;

    @Column({ default: 0 })
    isTop: number;

    @Column({ default: 0 })
    parentId: number;

    @CreateDateColumn()
    createDate: string;

    @Column()
    blog: string;

    @Column()
    fromMail: string;

    @Column()
    toMail: string;

    @ManyToOne(type => User, user => user.froms)
    @JoinColumn({ name: "fromId" })
    from: User;

    @ManyToOne(type => User, user => user.tos)
    @JoinColumn({ name: "toId" })
    to: User;

}
