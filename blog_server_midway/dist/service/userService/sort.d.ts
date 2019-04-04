import { Sort } from "../../entity/Sort";
export declare class UserSortService {
    repository: import("typeorm").Repository<Sort>;
    list(options: any): Promise<[Sort[], number]>;
}
