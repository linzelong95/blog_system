import { Article } from "./Article";
import { Reply } from "./Reply";
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: number;
    account: string;
    password: string;
    roleName: UserRole;
    nickName: string;
    articles: Article[];
    froms: Reply[];
    tos: Reply[];
}
