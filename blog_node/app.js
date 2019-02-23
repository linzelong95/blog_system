const Koa=require("koa");
const router=require("koa-router")();
const static=require("koa-static");
const render=require("koa-art-template");
const path=require("path");
// const ObjectId=require("mongodb").ObjectId;
// const MongoClient=require("mongodb").MongoClient;
// const mysql=require("mysql");
const bodyParser=require("koa-bodyparser");
const session=require("koa-session");
const cors=require("koa2-cors");
const db=require("./components/db");
const passport=require("./components/passport");



const app=new Koa();
render(app,{
  root:path.join(__dirname,"views"),
  extname:".html",
  debug:process.env.NODE_ENV!=="production"
});
app.use(static(path.join(__dirname,"statics")));
app.use(bodyParser());
app.use(cors());
app.keys=["linzelong"];
app.use(session({
  key:"koa:sess",
  maxAge:7*24*60*60*1000,
  overwrite:true,
  httpOnly:true,
  signed:true
},app));
app.use(passport.initialize());
app.use(passport.session());


const admin=require("./routes/admin.js");
const api=require("./routes/api.js");
const index=require("./routes/index.js");
const account=require("./routes/account.js")(router,db,passport);
const user=require("./routes/user.js");



// test
// router.post('/login', ctx => {
//   console.log("body",ctx.request.body)
//   // 会调用策略
//   return passport.authenticate('local',
//     function(err, user, info, status) {
//       ctx.body = {user, err, info, status}
//       // return ctx.login({id: 1, username: 'admin', password: '123456'})
//       return ctx.login(user)//触发序列化函数，保存到session
//     })(ctx)
// })
// router.get('/logout', ctx => {
//   ctx.logout()
//   ctx.body = {auth: ctx.isAuthenticated(), user: ctx.state.user}
// })

// router.get('/test', ctx => {
//   ctx.body=ctx.state.user;
  
// })
// router.get('/logout', ctx => {
//   ctx.logout()
//   ctx.body = {auth: ctx.isAuthenticated(), user: ctx.state.user}
// })

//session拦截
// app.use(async (ctx, next) => {
//   const allowpage = ['/account/','/user/']
//   let url = ctx.originalUrl
//   console.log(url)
//   if (allowpage.indexOf(url) > -1) {
//       logger.info('当前地址可直接访问')
//   }else {
//       if (ctx.isAuthenticated()) {
//           console.log('login status validate success')
//       } else {
//           console.log(ctx.url,'login status validate fail')
//       }
//   }
//     await next()

// })
// router.use('/admin/*', (ctx, next) => {
//   if(ctx.isAuthenticated()) {
//     next();
//   } else {
//    ctx.status = 401;
//    ctx.body = {msg: '用户未登录'};
//  }
// })


router.use("/index",index);
router.use("/account",account);
router.use("/admin",admin);
router.use("/user",user);
router.use("/api",api);

app.use(router.routes()).use(router.allowedMethods());






app.listen(3000,()=>console.log("do something"));