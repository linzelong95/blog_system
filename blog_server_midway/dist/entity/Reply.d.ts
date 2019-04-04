import { User } from "./User";
import { Article } from "./Article";
export declare class Reply {
    id: number;
    reply: string;
    isApproved: number;
    isTop: number;
    parentId: number;
    createDate: string;
    from: User;
    to: User;
    article: Article;
}
