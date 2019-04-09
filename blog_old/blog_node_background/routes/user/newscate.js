const router=require("koa-router")();

router.get("/",async (ctx)=>{
    // ctx.body="新闻分类首页";
    await ctx.render("admin/newscate/index");
});

router.get("/add",async (ctx)=>{
    // ctx.body="增加新闻分类";
    await ctx.render("admin/newscate/add");
});

router.get("/edit",async (ctx)=>{
    // ctx.body="编辑新闻分类";
    await ctx.render("admin/newscate/edit");
});

router.get("/delete",async (ctx)=>{
    ctx.body="删除新闻分类";
});

module.exports=router.routes();