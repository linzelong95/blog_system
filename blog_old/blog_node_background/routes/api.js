const router=require("koa-router")();

router.get("/",(ctx)=>{
    ctx.body={"title":"这是一个api"};
});

router.get("/newslist",(ctx)=>{
    ctx.body={"title":"这是一个新闻列表api"};
});

router.get("/focus",(ctx)=>{
    ctx.body={"title":"这是一个轮播图api"};
});


module.exports=router.routes();