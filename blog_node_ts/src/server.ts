import "reflect-metadata";
import { createConnection} from "typeorm";
import * as Koa from "koa";
import * as Router from "koa-router";
import * as Static from "koa-static";
import * as path from "path";
import * as bodyParser from "koa-bodyparser";
import * as cors from "koa-cors";
import * as session from "koa-session";
import passport from "./components/passport";
// const admin = require("./routes/admin.js");
import account from "./routes/account";
// const user = require("./routes/user.js");
// const upload = require("./routes/upload.js");

    
createConnection().then(async ()=>{

  const app = new Koa();
  const router = new Router();

  // 静态资源访问目录配置
  app.use(Static(path.join(__dirname, "statics")));

  // 请求中json参数的提取
  app.use(bodyParser());

  // 跨域设置
  app.use(cors({
    credentials: true
  }));

  // session设置
  app.keys = ["linzelong"];
  app.use(session({
    key: "koa:sess",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    overwrite: true,
    httpOnly: true,
    signed: true
  }, app));

  // passport设置
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(async (ctx, next) => {
    const limitedUrls = ['/admin/', '/user/comment/delete','/user/comment/insert'];
    if (limitedUrls.some(i => ctx.originalUrl.includes(i)) && !ctx.isAuthenticated()) {
      ctx.status = 401;
      ctx.body = { errMsg: '用户未登录,将为您跳转到首页，请根据需要登录' };
      return;
    }
    await next();
  });

  router.use("/account", account);
  // router.use("/admin", admin);
  // router.use("/user", user);
  // router.use("/upload", upload);

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(5000, () => console.log("do something"));
}).catch(err=>console.log(err));




