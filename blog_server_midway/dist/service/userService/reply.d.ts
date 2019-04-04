import { Reply } from "../../entity/Reply";
export declare class UserReplyService {
    repository: import("typeorm").Repository<Reply>;
    list(options: any): Promise<[Reply[], number]>;
    save(options: any): Promise<boolean>;
    delete(options: any): Promise<boolean>;
}
