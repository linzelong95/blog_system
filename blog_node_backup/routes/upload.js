const router = require("koa-router")();
const upload=require("../components/upload");


router.post('/pic', upload.single('file'), async (ctx) => {
    // const type={
    //     1:"pic",
    //     2:"file",
    // }
    // const folder={
    //     1:"img/article"
    // }
    ctx.status=200;
    ctx.body = {
      filename: ctx.req.file.filename,
      url:`/img/article/${ctx.req.file.filename}`
    }
  })



module.exports = router.routes();