import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Sort } from "./Sort";
import { Article } from "./Article"

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isEnable: number;

    @Column()
    isUsed: number;

    @CreateDateColumn()
    createDate: string;

    @UpdateDateColumn()
    updateDate: string;

    @ManyToOne(type => Sort, sort => sort.tags)
    sort: Sort;

    @ManyToMany(type => Article, article => article.tags)
    @JoinTable()
    articles: Article[];

}