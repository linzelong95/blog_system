"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const app = new Koa();
const router = new Router();
router.get("/*", async (ctx) => {
    ctx.body = "hello122 world";
});
app.use(router.routes());
app.listen(4001);
//# sourceMappingURL=server.js.map