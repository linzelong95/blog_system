const router=require("koa-router")();

// const user=require("./user/user.js");
// const focus=require("./user/focus.js");
// const newscate=require("./user/newscate.js");
const article=require("./user/article.js");
const cate=require("./user/cate.js");
const sort=require("./user/sort.js");
const comment=require("./user/comment.js");



// router.use("/user",user);
// router.use("/focus",focus);
// router.use("/newscate",newscate);
router.use("/article",article);
router.use("/cate",cate);
router.use("/sort",sort);
router.use("/comment",comment);


module.exports=router.routes();