import { Article } from "../../entity/Article";
import { Content } from "../../entity/Content";
export declare class UserArticleService {
    repository: import("typeorm").Repository<Article>;
    list(options: any): Promise<[Article[], number]>;
    content(options: any): Promise<Content[]>;
}
