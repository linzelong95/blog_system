// passport.js
const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const db=require("../components/db");

// 序列化ctx.login()触发
passport.serializeUser((user, done)=> {
  console.log('serializeUser: ', user);
  done(null, user)
});

// 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
passport.deserializeUser(async (user, done)=> {
  console.log('deserializeUser: ', user)
  done(null, user)// 在其他路由使用ctx.state.user可以取得该信息
});

// 提交数据(策略)
passport.use(new LocalStrategy({
  usernameField: 'account',// 会自动获取用户的传参username和password，若字段名不一样，需手动设置
  passwordField: 'password'
}, async (username, password, done)=> {
  const rows=await db.query("select * from user where account=? and password=?", [username,password]);
  if(!rows.length) return done(null,false, {msg: '账号或密码错误'});
  done(null, rows[0], {msg: '校验通过'});// done(err, user, info)
}))


module.exports = passport;
