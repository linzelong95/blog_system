import * as passport from "koa-passport";
import * as passportLocal from "passport-local";
import {getRepository} from "typeorm";
import { User} from "../../entity/User";

const LocalStrategy = passportLocal.Strategy;

export default (options: any, app: any) => {
	return async (ctx: any, next: any) => {
		passport.use(new LocalStrategy({
			passReqToCallback: true,
			usernameField: "account",
			passwordField: "password"
		}, async (username, password, done) => {
			// const privateKey=fs.readFileSync(path.join(process.cwd(),"src/utils/rsa_1024_priv.pem"),"utf8");
			// const rsaPwd=Buffer.from(password,"base64");
			// const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING  }, rsaPwd );
			// const md5Pwd=decrypted.toString("utf8");
			// const userEntity=await getRepository(User)
			//   .createQueryBuilder("user")
			//   .where("user.account=:account",{account:username})
			//   .andWhere("user.password=:password",{password:md5Pwd})
			//   .getOne();
			const user = await getRepository(User)
				.createQueryBuilder("user")
				.where("user.account=:account", { account: username })
				.andWhere("user.password=:password", { password })
				.getOne();
			if (!user) return done(null, false, { message: '账号或密码错误' });
			done(null, user, { message: '校验通过' });// done(err, user, info)
		}))


		// 序列化ctx.login()触发
		passport.serializeUser((user, done) => {
			done(null, user)
		});

		// 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
		passport.deserializeUser(async (user, done) => {
			done(null, user)// 在其他路由使用ctx.state.user可以取得该信息
		});
		
		ctx.passport=passport;
		await next();
	};
};