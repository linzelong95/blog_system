"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("koa-passport");
const passportLocal = require("passport-local");
const crypto = require("crypto");
const constants = require("constants");
const typeorm_1 = require("typeorm");
const User_1 = require("../../entity/User");
const utils_1 = require("../../utils/utils");
const LocalStrategy = passportLocal.Strategy;
module.exports = (options, app) => {
    // 序列化ctx.login()触发
    passport.serializeUser((user, done) => {
        delete user.password;
        done(null, user);
    });
    // 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
    passport.deserializeUser(async (user, done) => {
        done(null, user); // 在其他路由使用ctx.state.user可以取得该信息
    });
    // 提交数据(策略)
    passport.use(new LocalStrategy({
        usernameField: 'account',
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
        const rsaPwd = Buffer.from(password, "base64");
        // 旧版本
        // const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, rsaPwd);
        const decrypted = crypto.privateDecrypt({ key: utils_1.rsaPrivateKey, padding: constants.RSA_PKCS1_PADDING }, rsaPwd);
        const md5Pwd = decrypted.toString("utf8"); // 解密完成
        const user = await typeorm_1.getRepository(User_1.User)
            .createQueryBuilder("user")
            // .addSelect("user.password")
            .where("user.account=:account", { account: username })
            .andWhere("user.password=:password", { password: md5Pwd })
            .getOne();
        if (!user)
            return done(null, false, { message: '账号或密码错误' });
        done(null, user, { message: '校验通过' }); // done(err, user, info)
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
            }
            else if (ctx.state.user.roleName !== "admin") {
                ctx.status = 401;
                ctx.body = { message: '无权限操作！', needRedirect: true };
                return;
            }
        }
        await next();
    });
    return async (ctx, next) => {
        await next();
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3BvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL21pZGRsZXdhcmUvcGFzc3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMsZ0RBQWdEO0FBQ2hELGlDQUFpQztBQUNqQyx1Q0FBdUM7QUFDdkMscUNBQXdDO0FBQ3hDLDRDQUF5QztBQUN6Qyw2Q0FBa0Q7QUFFbEQsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQztBQUU3QyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBRWhDLG1CQUFtQjtJQUNuQixRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUgsZ0RBQWdEO0lBQ2hELFFBQVEsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBLENBQUEsK0JBQStCO0lBQ2pELENBQUMsQ0FBQyxDQUFDO0lBRUgsV0FBVztJQUNYLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxhQUFhLENBQUM7UUFDN0IsYUFBYSxFQUFFLFNBQVM7UUFDeEIsYUFBYSxFQUFFLFVBQVU7S0FDMUIsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNwQyxRQUFRO1FBQ1IsU0FBUztRQUNULDBCQUEwQjtRQUMxQixVQUFVO1FBQ1YsNkZBQTZGO1FBQzdGLHlDQUF5QztRQUN6QyxpRUFBaUU7UUFDakUsd0RBQXdEO1FBQ3hELFVBQVU7UUFDViwrRkFBK0Y7UUFDL0YsaURB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