import * as passport from "koa-passport";
import * as passportLocal from "passport-local";
import * as crypto from "crypto";
import * as fs from "fs";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";

const LocalStrategy = passportLocal.Strategy;

module.exports = (options, app) => {

  // 序列化ctx.login()触发
  passport.serializeUser((user, done) => {
    delete user.password;
    done(null, user)
  });

  // 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
  passport.deserializeUser(async (user, done) => {
    console.log(user)
    done(null, user)// 在其他路由使用ctx.state.user可以取得该信息
  });

  // 提交数据(策略)
  passport.use(new LocalStrategy({
    usernameField: 'account',// 会自动获取用户的传参username和password，若字段名不一样，需手动设置
    passwordField: 'password'
  }, async (username, password, done) => {
    // 同端加解密
    // // 加密前
    // const testPwd="123456";
    // // 公钥加密
    // const publicKey=fs.readFileSync(path.join(process.cwd(),"utils/rsa_1024_pub.pem"),"utf8");
    // const md5Pwd_pud=Buffer.from(testPwd);
    // const encrypted = crypto.publicEncrypt(publicKey, md5Pwd_pud);
    // const rsaPwd_pud=encrypted.toString('base64');// 加密完成
    // // 私钥解密
    // const privateKey=fs.readFileSync(path.join(process.cwd(),"utils/rsa_1024_priv.pem"),"utf8");
    // const rsaPwd=Buffer.from(rsaPwd_pud,"base64");
    // const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING  }, rsaPwd );
    // const md5Pwd=decrypted.toString("utf8");// 解密完成
    // 注意：加密和解密同在后端，padding用的是crypto.constants.RSA_PKCS1_OAEP_PADDING；若加密在前端解密在后端，padding用的是crypto.constants.RSA_PKCS1_PADDING。

    // 私钥解密
    const privateKey = fs.readFileSync(`${app.baseDir}/utils/rsa_1024_priv.pem`, "utf8");
    const rsaPwd = Buffer.from(password, "base64");
    const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, rsaPwd);
    const md5Pwd = decrypted.toString("utf8");// 解密完成
    const user = await getRepository(User)
      .createQueryBuilder("user")
      // .addSelect("user.password")
      .where("user.account=:account", { account: username })
      .andWhere("user.password=:password", { password: md5Pwd })
      .getOne();
    if (!user) return done(null, false, { message: '账号或密码错误' });
    done(null, user, { message: '校验通过' });// done(err, user, info)
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.passport = passport;
  app.use(async (ctx, next) => {
    const adminUrls = ['/admin/'];
    const userUrls = ['/user/comment/delete', '/user/comment/insert'];
    if (userUrls.some(i => ctx.originalUrl.includes(i)) && !ctx.isAuthenticated()) {
      ctx.status = 401;
      ctx.body = { message: '用户未登录!', needRedirect: false };
      return;
    }
    if (adminUrls.some(i => ctx.originalUrl.includes(i))) {
      if (!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = { message: '管理员未登录!', needRedirect: true };
        return;
      } else if (ctx.state.user.roleName !== "admin") {
        ctx.status = 401;
        ctx.body = { message: '无权限操作！', needRedirect: true };
        return;
      }
    }
    await next();
  });
  return async (ctx: any, next: any) => {
    await next();
  }
}