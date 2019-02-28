const Koa = require("koa");
const router = require("koa-router")();
const static = require("koa-static");
const render = require("koa-art-template");
const path = require("path");
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");
const cors = require("koa2-cors");
const db = require("./components/db");
const passport = require("./components/passport");

const admin = require("./routes/admin.js");
const account = require("./routes/account.js")(router, db, passport);
const user = require("./routes/user.js");

const app = new Koa();
render(app, {
  root: path.join(__dirname, "views"),
  extname: ".html",
  debug: process.env.NODE_ENV !== "production"
});
app.use(static(path.join(__dirname, "statics")));
app.use(bodyParser());
app.use(cors());
app.keys = ["linzelong"];
app.use(session({
  key: "koa:sess",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: true
}, app));
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
router.use("/admin", admin);
router.use("/user", user);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log("do something"));