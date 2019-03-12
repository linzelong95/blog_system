"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const Router = require("koa-router");
const captchapng = require("captchapng");
const typeorm_1 = require("typeorm");
const passport_1 = require("../components/passport");
const User_1 = require("../entity/User");
const router = new Router();
router.post("/register", async (ctx) => {
    const { mail: account, password } = ctx.request.body;
    const existentUser = await typeorm_1.getRepository(User_1.User)
        .createQueryBuilder("user")
        .where("user.account=:account", { account })
        .getOne();
    if (existentUser) {
        ctx.status = 400;
        ctx.body = { errMsg: "该用户已存在" };
        return;
    }
    const user = await typeorm_1.getRepository(User_1.User).create({
        account,
        password,
        roleName: "user",
        nickName: account
    });
    await typeorm_1.getRepository(User_1.User).save(user);
    ctx.status = 200;
    ctx.body = { msg: "注册成功" };
});
router.post("/login", async (ctx, next) => {
    return passport_1.default.authenticate('local', (err, user, info) => {
        if (!user || err) {
            ctx.status = 400;
            ctx.body = info;
            return;
        }
        ctx.status = 200;
        ctx.body = user;
        return ctx.login(user);
    })(ctx, next);
});
router.post("/logout", async (ctx) => {
    ctx.logout();
    ctx.status = 200;
    ctx.body = { msg: "退出成功" };
});
router.post("/getpublickey", async (ctx) => {
    const publicKey = fs.readFileSync(path.join(process.cwd(), "utils/rsa_1024_pub.pem"), "utf8");
    ctx.body = { item: publicKey };
});
router.post("/getcaptcha", async (ctx) => {
    const cap = Math.random() * 9000 + 1000;
    const p = new captchapng(80, 30, cap);
    p.color(255, 255, 2, 3);
    p.color(255, 80, 80, 255);
    const base64 = p.getBase64();
    if (!base64) {
        ctx.status = 400;
        ctx.body = { errMsg: "获取验证码失败" };
    }
    else {
        ctx.session.cap = cap;
        ctx.status = 200;
        ctx.body = { item: base64 };
    }
});
router.post("/verifycaptcha", async (ctx) => {
    const { captcha } = ctx.request.body;
    const { cap } = ctx.session;
    if (captcha === `${cap}`) {
        ctx.status = 200;
        ctx.body = { msg: "验证成功" };
    }
    else {
        ctx.status = 400;
        ctx.body = { errMsg: "验证失败" };
    }
});
exports.default = router.routes();
//# sourceMappingURL=account.js.map