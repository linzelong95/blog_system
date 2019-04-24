import { Tag } from "../../entity/Tag";
export declare class AdminTagService {
    repository: import("typeorm").Repository<Tag>;
    list(options: any): Promise<[Tag[], number]>;
    save(options: any): Promise<boolean>;
    delete(ids: number[]): Promise<boolean>;
    lock(ids: number[]): Promise<boolean>;
    unlock(ids: number[]): Promise<boolean>;
}
