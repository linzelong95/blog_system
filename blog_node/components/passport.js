const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  // 数据库查询校验操作
  done(null, { id })
});

passport.use(new LocalStrategy({
  usernameField: "account",
  passwordField: "password"
}, (username, password, done) => {
  User.findOne({ username: username }, function (err, result) {
    if (result !== null) {
      if (result.password === md5(password)) {
        return done(null, doPassword(result), '登录成功')
      } else {
        return done(null, false, '密码错误')
      }
    } else {
      return done(null, false, '用户不存在')
    }
  }).catch(function (err) {
    logger.error(err.message)
    return done(null, false, { message: err.message })
  })
}));

module.exports = passport;