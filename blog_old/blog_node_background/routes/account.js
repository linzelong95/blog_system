const fs = require("fs");
const path = require("path");
const captchapng=require("captchapng");

module.exports = function (router, db, passport) {
    router.post("/register", async (ctx) => {
        const { mail: account, password } = ctx.request.body;
        const checkNameResult = await db.query("select * from user where account=?", [account]);
        if (checkNameResult.length) {
            ctx.status=400;
            ctx.body = { errMsg: "该用户已存在" };
            return;
        }
        const res = await db.query("insert into user (account,password,nick_name) values(?,?,?)", [account, password, account]);
        ctx.status=200;
        ctx.body = { msg:"注册成功" };
    });

    router.post("/login", async (ctx) => {
        return passport.authenticate('local', (err, user, info) => {
            if (!user) {
                ctx.status = 400;
                ctx.body = info;
                return;
            }
            ctx.status = 200;
            ctx.body = user;
            return ctx.login(user);
        })(ctx);
    });

    router.post("/logout", async (ctx) => {
        ctx.logout();
        ctx.status=200;
        ctx.body = { msg: "退出成功" }
    });

    router.post("/getpublickey", async (ctx) => {
        const publicKey = fs.readFileSync(path.join(process.cwd(), "utils/rsa_1024_pub.pem"), "utf8");
        ctx.body = { item: publicKey };
    });

    router.post("/getcaptcha", async (ctx) => {
        const cap=parseInt(Math.random()*9000+1000,10);
        const p=new captchapng(80,30,cap);
        p.color(255,255,2,3);
        p.color(255,80,80,255);
        const base64=p.getBase64();
        if(!base64){
            ctx.status=400;
            ctx.body={errMsg:"获取验证码失败"};
        }else{
            ctx.session.cap=cap;
            ctx.status=200;
            ctx.body={item:base64};
        }
    });

    router.post("/verifycaptcha", async (ctx) => {
        const {captcha}=ctx.request.body;
        const {cap}=ctx.session;
        if(captcha===`${cap}`){
            ctx.status=200;
            ctx.body={msg:"验证成功"};
        }else{
            ctx.status=400;
            ctx.body={errMsg:"验证失败"};
        }
        
    });

    return router.routes();
}
