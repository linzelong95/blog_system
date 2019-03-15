import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Category } from "./Category";
import { Tag } from "./Tag";

@Entity()
export class Sort {

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

    @OneToMany(type => Category, category => category.sort)
    categories: Category[];

    @OneToMany(type => Tag, tag => tag.sort)
    tags: Tag[];

}