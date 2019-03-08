import * as Koa from "koa";
import * as Router from "koa-router";

const app=new Koa();
const router =new Router();

router.get("/*",async (ctx)=>{
  ctx.body="hello1 world";
});

app.use(router.routes());

app.listen(4001);