"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const midway_1 = require("midway");
const typeorm_1 = require("typeorm");
const User_1 = require("../../../entity/User");
const utils_1 = require("../../../utils/utils");
const captchapng = require("captchapng");
let AccountController = class AccountController {
    async login(ctx) {
        return ctx.app.passport.authenticate('local', (err, user, info) => {
            if (!user || err) {
                ctx.status = 400;
                ctx.body = info;
                return;
            }
            ctx.status = 200;
            ctx.body = user;
            return ctx.login(user);
        })(ctx);
    }
    async register(ctx) {
        const { mail: account, password } = ctx.request.body;
        const existentUser = await typeorm_1.getRepository(User_1.User)
            .createQueryBuilder("user")
            .where("user.account=:account", { account })
            .getOne();
        if (existentUser) {
            ctx.status = 400;
            ctx.body = { message: "该用户已存在", flag: false };
            return;
        }
        const user = await typeorm_1.getRepository(User_1.User).create({
            account,
            password,
            nickName: account
        });
        await typeorm_1.getRepository(User_1.User).save(user);
        ctx.status = 200;
        ctx.body = { message: "注册成功", flag: true };
    }
    async logout(ctx) {
        ctx.logout();
        ctx.status = 200;
        ctx.body = { message: "退出成功", flag: true };
    }
    async getpublickey(ctx) {
        ctx.body = { item: utils_1.rsaPublicKey };
    }
    async getcaptcha(ctx) {
        const cap = Math.floor(Math.random() * 9000 + 1000);
        const p = new captchapng(80, 30, cap);
        p.color(0, 0, 0, 0);
        p.color(80, 80, 80, 255);
        const base64 = p.getBase64();
        if (!base64) {
            ctx.status = 400;
            ctx.body = { message: "获取验证码失败", flag: false };
        }
        else {
            ctx.session.cap = cap;
            ctx.status = 200;
            ctx.body = { item: base64 };
        }
    }
    async verifycaptcha(ctx) {
        const { captcha } = ctx.request.body;
        const { cap } = ctx.session;
        if (captcha === `${cap}`) {
            ctx.status = 200;
            ctx.body = { message: "验证成功", flag: true };
        }
        else {
            ctx.status = 400;
            ctx.body = { message: "验证失败", flag: false };
        }
    }
};
__decorate([
    midway_1.post("/login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "login", null);
__decorate([
    midway_1.post("/register"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "register", null);
__decorate([
    midway_1.post("/logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "logout", null);
__decorate([
    midway_1.post("/getpublickey"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getpublickey", null);
__decorate([
    midway_1.post("/getcaptcha"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getcaptcha", null);
__decorate([
    midway_1.post("/verifycaptcha"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "verifycaptcha", null);
AccountController = __decorate([
    midway_1.provide(),
    midway_1.controller("/account")
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9hY2NvdW50Q29udHJvbGxlci9hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUNBQW1EO0FBQ25ELHFDQUF3QztBQUN4QywrQ0FBNEM7QUFDNUMsZ0RBQW9EO0FBRXBELE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUl6QyxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtJQUc1QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUc7UUFDYixPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2hFLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFO2dCQUNoQixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztnQkFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLE9BQU87YUFDUjtZQUNELEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLENBQUM7SUFHRCxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7UUFDaEIsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDckQsTUFBTSxZQUFZLEdBQUcsTUFBTSx1QkFBYSxDQUFDLFdBQUksQ0FBQzthQUMzQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7YUFD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