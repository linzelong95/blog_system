import { Sort } from "../../entity/Sort";
export declare class AdminSortService {
    repository: import("typeorm").Repository<Sort>;
    list(options: any): Promise<[Sort[], number]>;
    save(options: any): Promise<boolean>;
    delete(ids: number[]): Promise<boolean>;
    lock(ids: number[]): Promise<boolean>;
    unlock(ids: number[]): Promise<boolean>;
}
