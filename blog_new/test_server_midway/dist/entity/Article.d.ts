import { Category } from "./Category";
import { User } from "./User";
import { Content } from "./Content";
import { Tag } from "./Tag";
import { Reply } from "./Reply";
export declare class Article {
    id: number;
    title: string;
    abstract: string;
    imageUrl: string;
    isEnable: number;
    createDate: string;
    updateDate: string;
    isTop: number;
    content: Content;
    category: Category;
    user: User;
    tags: Tag[];
    replies: Reply[];
}
