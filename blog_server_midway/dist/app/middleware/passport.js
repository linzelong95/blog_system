"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("koa-passport");
const passportLocal = require("passport-local");
const crypto = require("crypto");
const fs = require("fs");
const typeorm_1 = require("typeorm");
const User_1 = require("../../entity/User");
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
        const privateKey = fs.readFileSync(`${app.baseDir}/utils/rsa_1024_priv.pem`, "utf8");
        const rsaPwd = Buffer.from(password, "base64");
        const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING }, rsaPwd);
        const md5Pwd = decrypted.toString("utf8"); // 解密完成
        const user = await typeorm_1.getRepository(User_1.User)
            .createQueryBuilder("user")
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
        const limitedUrls = ['/admin/', '/user/comment/delete', '/user/comment/insert'];
        if (limitedUrls.some(i => ctx.originalUrl.includes(i)) && !ctx.isAuthenticated()) {
            ctx.status = 401;
            ctx.body = { errMsg: '用户未登录,将为您跳转到首页，请根据需要登录' };
            return;
        }
        await next();
    });
    return async (ctx, next) => {
        await next();
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3BvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL21pZGRsZXdhcmUvcGFzc3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFDekMsZ0RBQWdEO0FBQ2hELGlDQUFpQztBQUNqQyx5QkFBeUI7QUFDekIscUNBQXdDO0FBQ3hDLDRDQUF5QztBQUV6QyxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDO0FBRTdDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFFaEMsbUJBQW1CO0lBQ25CLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDcEMsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxnREFBZ0Q7SUFDaEQsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1FBQzVDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUEsQ0FBQSwrQkFBK0I7SUFDakQsQ0FBQyxDQUFDLENBQUM7SUFFSCxXQUFXO0lBQ1gsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLGFBQWEsQ0FBQztRQUM3QixhQUFhLEVBQUUsU0FBUztRQUN4QixhQUFhLEVBQUUsVUFBVTtLQUMxQixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3BDLFFBQVE7UUFDUixTQUFTO1FBQ1QsMEJBQTBCO1FBQzFCLFVBQVU7UUFDViw2RkFBNkY7UUFDN0YseUNBQXlDO1FBQ3pDLGlFQUFpRTtRQUNqRSx3REFBd0Q7UUFDeEQsVUFBVTtRQUNWLCtGQUErRjtRQUMvRixpREFBaUQ7UUFDakQsNEhBQTRIO1FBQzVILGtEQUFrRDtRQUNsRCwySEFBMkg7UUFFM0gsT0FBTztRQUNQLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTywwQkFBMEIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNyRixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ2xILE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxPQUFPO1FBQ2pELE1BQU0sSUFBSSxHQUFHLE1BQU0sdUJBQWEsQ0FBQyxXQUFJLENBQUM7YUFDbkMsa0JBQWtCLENBQUMsTUFBTSxDQUFDO2FBQzFCLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQzthQUNyRCxRQUFRLENBQUMseUJBQXlCLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7YUFDekQsTUFBTSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUEsd0JBQXdCO0lBQ2hFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDSixHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDNUIsR0FBRyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQzFCLE1BQU0sV0FBVyxHQUFHLENBQUMsU0FBUyxFQUFFLHNCQUFzQixFQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDL0UsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsRUFBRTtZQUNoRixHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLHdCQUF3QixFQUFFLENBQUM7WUFDaEQsT0FBTztTQUNSO1FBQ0QsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxLQUFLLEVBQUUsR0FBUSxFQUFFLElBQVMsRUFBRSxFQUFFO1FBQ25DLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDZixDQUFDLENBQUE7QUFDSCxDQUFDLENBQUEifQ==