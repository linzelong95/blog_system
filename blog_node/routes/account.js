const router=require("koa-router")();
const db=require("../components/db");

router.post("/register",async (ctx)=>{
    console.log(ctx.request.body);
    const {mail:account,password}=ctx.request.body;
    const checkNameResult=await db.query("select * from user where account=?", [account]);
    if(checkNameResult.length){
        ctx.body={msg:"该用户已存在"};
        return;
    }
    const res=await db.query("insert into user (account,password,role_name) values(?,?,?)", [account,password,account]);
    ctx.body={status:true};
});

router.post("/login",async (ctx)=>{
    const {account,password}=ctx.request.body;
    const res=await db.query("select * from user where account=? and password=?", [account,password]);
    ctx.session.userInfo=res[0];
    ctx.body=res[0];
});

router.post("/logout",async (ctx)=>{
    ctx.session=null;
});



module.exports=router.routes();