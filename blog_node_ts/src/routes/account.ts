import * as path from "path";
import * as fs from "fs";
import * as Router from "koa-router";
const captchapng=require("captchapng");
import { getRepository } from "typeorm";
import passport from "../components/passport";
import { User } from "../entity/User";

const router = new Router();
router.post("/register", async (ctx) => {
    const { mail: account, password } = ctx.request.body;
    const existentUser = await getRepository(User)
        .createQueryBuilder("user")
        .where("user.account=:account", { account })
        .getOne();
    if (existentUser) {
        ctx.status = 400;
        ctx.body = { errMsg: "该用户已存在" };
        return;
    }
    const user = await getRepository(User).create({
        account,
        password,
        roleName: "user",
        nickName: account
    });
    await getRepository(User).save(user);
    ctx.status = 200;
    ctx.body = { msg: "注册成功" };
});

router.post("/login", async (ctx,next) => {
    return passport.authenticate('local', (err, user, info) => {
        if (!user || err) {
            ctx.status = 400;
            ctx.body = info;
            return;
        }
        ctx.status = 200;
        ctx.body = user;
        return ctx.login(user);
    })(ctx,next);
});

router.post("/logout", async (ctx) => {
    ctx.logout();
    ctx.status = 200;
    ctx.body = { msg: "退出成功" }
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
    } else {
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
    } else {
        ctx.status = 400;
        ctx.body = { errMsg: "验证失败" };
    }
});

export default router.routes();
