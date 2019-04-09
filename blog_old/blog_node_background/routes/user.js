const router=require("koa-router")();

const label=require("./user/label.js");
const article=require("./user/article.js");
const cate=require("./user/cate.js");
const sort=require("./user/sort.js");
const comment=require("./user/comment.js");



router.use("/label",label);
router.use("/article",article);
router.use("/cate",cate);
router.use("/sort",sort);
router.use("/comment",comment);


module.exports=router.routes();