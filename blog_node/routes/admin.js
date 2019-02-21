const router=require("koa-router")();

const user=require("./admin/user.js");
const focus=require("./admin/focus.js");
const newscate=require("./admin/newscate.js");
const article=require("./admin/article.js");
const cate=require("./admin/cate.js");
const sort=require("./admin/sort.js");
const comment=require("./admin/comment.js");

router.get("/",(ctx)=>{
    ctx.body="后台管理系统首页";
});


router.use("/user",user);
router.use("/focus",focus);
router.use("/newscate",newscate);
router.use("/article",article);
router.use("/cate",cate);
router.use("/sort",sort);
router.use("/comment",comment);


module.exports=router.routes();