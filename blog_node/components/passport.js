// passport.js
const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const db=require("../components/db");
const fs=require("fs");
const path=require("path");
const crypto=require("crypto");

// 序列化ctx.login()触发
passport.serializeUser((user, done)=> {
  done(null, user)
});

// 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
passport.deserializeUser(async (user, done)=> {
  done(null, user)// 在其他路由使用ctx.state.user可以取得该信息
});

// 提交数据(策略)
passport.use(new LocalStrategy({
  usernameField: 'account',// 会自动获取用户的传参username和password，若字段名不一样，需手动设置
  passwordField: 'password'
}, async (username, password, done)=> {
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
  const privateKey=fs.readFileSync(path.join(process.cwd(),"utils/rsa_1024_priv.pem"),"utf8");
  const rsaPwd=Buffer.from(password,"base64");
  const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING  }, rsaPwd );
  const md5Pwd=decrypted.toString("utf8");// 解密完成
  const rows=await db.query("select * from user where account=? and password=?", [username,md5Pwd]);
  if(!rows.length) return done(null,false, {errMsg: '账号或密码错误'});
  done(null, rows[0], {msg: '校验通过'});// done(err, user, info)
}))


module.exports = passport;
