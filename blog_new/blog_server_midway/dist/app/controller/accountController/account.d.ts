export declare class AccountController {
    login(ctx: any): Promise<void>;
    register(ctx: any): Promise<void>;
    logout(ctx: any): Promise<void>;
    getpublickey(ctx: any): Promise<void>;
    getcaptcha(ctx: any): Promise<void>;
    verifycaptcha(ctx: any): Promise<void>;
}
