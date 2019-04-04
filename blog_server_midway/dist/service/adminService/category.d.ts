import { Category } from "../../entity/Category";
export declare class AdminCategoryService {
    repository: import("typeorm").Repository<Category>;
    list(options: any): Promise<[Category[], number]>;
    save(options: any): Promise<boolean>;
    delete(ids: number[]): Promise<boolean>;
    lock(ids: number[]): Promise<boolean>;
    unlock(ids: number[]): Promise<boolean>;
}
