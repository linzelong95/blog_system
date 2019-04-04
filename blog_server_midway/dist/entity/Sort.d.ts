import { Category } from "./Category";
import { Tag } from "./Tag";
export declare class Sort {
    id: number;
    name: string;
    isEnable: number;
    isUsed: number;
    createDate: string;
    updateDate: string;
    categories: Category[];
    tags: Tag[];
}
