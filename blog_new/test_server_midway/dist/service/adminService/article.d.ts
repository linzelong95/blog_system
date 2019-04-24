import { Article } from "../../entity/Article";
import { Content } from "../../entity/Content";
export declare class AdminArticleService {
    repository: import("typeorm").Repository<Article>;
    list(options: any): Promise<[Article[], number]>;
    content(options: any): Promise<Content[]>;
    save(options: any): Promise<boolean>;
    delete(ids: number[]): Promise<boolean>;
    lock(ids: number[]): Promise<boolean>;
    unlock(ids: number[]): Promise<boolean>;
    top(ids: number[]): Promise<boolean>;
    untop(ids: number[]): Promise<boolean>;
}
