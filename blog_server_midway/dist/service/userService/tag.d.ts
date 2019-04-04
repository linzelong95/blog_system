import { Tag } from "../../entity/Tag";
export declare class UserTagService {
    repository: import("typeorm").Repository<Tag>;
    list(options: any): Promise<[Tag[], number]>;
}
