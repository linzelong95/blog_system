import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, ManyToMany, OneToMany } from "typeorm";
import { Category } from "./Category";
import { User } from "./User";
import { Content } from "./Content";
import { Tag } from "./Tag";
import { Reply } from "./Reply";

@Entity()
export class Article {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  abstract: string;

  @Column({ default: 1 })
  isEnable: number;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;

  @Column({ default: 0 })
  isTop: number;

  @OneToOne(type => Content, content => content.article, { cascade: true })
  content: Content;

  @ManyToOne(type => Category, category => category.articles)
  category: Category;

  @ManyToOne(type => User, user => user.articles)
  user: User;

  @ManyToMany(type => Tag, tag => tag.articles)
  tags: Tag[];

  @OneToMany(type => Reply, reply => reply.article)
  replies: Reply[];

}