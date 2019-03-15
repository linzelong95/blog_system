import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Sort } from "./Sort";
import { Article } from "./Article"

@Entity()
export class Category {

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

    @ManyToOne(type => Sort, sort => sort.categories)
    sort: Sort;

    @OneToMany(type => Article, article => article.category)
    articles: Article[];

}