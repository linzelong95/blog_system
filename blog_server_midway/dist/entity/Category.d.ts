import { Sort } from "./Sort";
import { Article } from "./Article";
export declare class Category {
    id: number;
    name: string;
    isEnable: number;
    isUsed: number;
    createDate: string;
    updateDate: string;
    sort: Sort;
    articles: Article[];
}
