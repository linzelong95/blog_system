const fs = require("fs");
const path = require("path");

module.exports = function (router, db, passport) {
    router.post("/register", async (ctx) => {
        const { mail: account, password } = ctx.request.body;
        const checkNameResult = await db.query("select * from user where account=?", [account]);
        if (checkNameResult.length) {
            ctx.body = { msg: "该用户已存在" };
            return;
        }
        const res = await db.query("insert into user (account,password,nick_name) values(?,?,?)", [account, password, account]);
        ctx.body = { status: true };
    });

    router.post("/login", async (ctx) => {
        return passport.authenticate('local', (err, user, info) => {
            if (!user) {
                ctx.status = 404;
                ctx.body = info;
                return;
            }
            ctx.status = 200;
            ctx.body = user;
            return ctx.login(user)//触发序列化函数，保存到session
        })(ctx);
    });

    router.post("/logout", async (ctx) => {
        ctx.logout();
        ctx.status=200;
        ctx.body = { msg: "ok" }
    });

    router.post("/getpublickey", async (ctx) => {
        const publicKey = fs.readFileSync(path.join(process.cwd(), "utils/rsa_1024_pub.pem"), "utf8");
        ctx.body = { item: publicKey };
    });

    return router.routes();
}
