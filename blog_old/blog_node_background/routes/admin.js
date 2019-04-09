const router=require("koa-router")();

const article=require("./admin/article.js");
const cate=require("./admin/cate.js");
const sort=require("./admin/sort.js");
const label=require("./admin/label.js");
const comment=require("./admin/comment.js");

router.get("/",(ctx)=>{
    ctx.body="后台管理系统首页";
});



router.use("/article",article);
router.use("/cate",cate);
router.use("/sort",sort);
router.use("/label",label);
router.use("/comment",comment);


module.exports=router.routes();