import { provide, controller, post } from "midway";
import { getRepository } from "typeorm";
import { User } from "../../../entity/User";
import { rsaPublicKey } from "../../../utils/utils";

const captchapng = require("captchapng");

@provide()
@controller("/account")
export class AccountController {

  @post("/login")
  async login(ctx): Promise<void> {
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

  @post("/register")
  async register(ctx): Promise<void> {
    const { mail: account, password } = ctx.request.body;
    const existentUser = await getRepository(User)
      .createQueryBuilder("user")
      .where("user.account=:account", { account })
      .getOne();
    if (existentUser) {
      ctx.status = 400;
      ctx.body = { message: "该用户已存在", flag: false };
      return;
    }
    const user = await getRepository(User).create({
      account,
      password,
      nickName: account
    });
    await getRepository(User).save(user);
    ctx.status = 200;
    ctx.body = { message: "注册成功", flag: true };
  }

  @post("/logout")
  async logout(ctx) {
    ctx.logout();
    ctx.status = 200;
    ctx.body = { message: "退出成功", flag: true }
  }

  @post("/getpublickey")
  async getpublickey(ctx) {
    ctx.body = { item: rsaPublicKey };
  }

  @post("/getcaptcha")
  async getcaptcha(ctx) {
    const cap: number = Math.floor(Math.random() * 9000 + 1000);
    const p = new captchapng(80, 30, cap);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);
    const base64 = p.getBase64();
    if (!base64) {
      ctx.status = 400;
      ctx.body = { message: "获取验证码失败", flag: false };
    } else {
      ctx.session.cap = cap;
      ctx.status = 200;
      ctx.body = { item: base64 };
    }
  }

  @post("/verifycaptcha")
  async verifycaptcha(ctx) {
    const { captcha } = ctx.request.body;
    const { cap } = ctx.session;
    if (captcha === `${cap}`) {
      ctx.status = 200;
      ctx.body = { message: "验证成功", flag: true };
    } else {
      ctx.status = 400;
      ctx.body = { message: "验证码错误", flag: false };
    }
  }

}



