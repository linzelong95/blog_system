import { provide, controller, post, inject } from "midway";

@provide()
@controller("/admin/reply")
export class AdminReplyController {

  @inject()
  adminReplyService;

  @post("/list")
  async list(ctx): Promise<void> {
    const { conditionQuery: { reply = "", orderBy = {}, category = {}, articleIdsArr = [], isTop, isApproved, isRoot }, index = 1, size = 10 } = ctx.request.body;
    const [list, count] = await this.adminReplyService.list({ reply, orderBy, index, size, category, articleIdsArr, isTop, isApproved, isRoot });
    ctx.body = { list, count };
  }

  @post("/insert")
  @post("/update")
  async save(ctx): Promise<void> {
    const { id, reply, parentId = 0, fromId, toId, articleId, isApproved = 1 } = ctx.request.body;
    const flag = await this.adminReplyService.save({ id, reply, parentId, from: { id: fromId }, to: { id: toId }, isApproved, article: { id: articleId } });
    const action = id ? "更新" : "添加";
    if (!flag) {
      ctx.status = 400;
      ctx.body = { message: `${action}失败`, flag };
      return;
    }
    ctx.status = 200;
    ctx.body = { message: `${action}成功`, flag };
  }

  @post("/delete")
  async delete(ctx): Promise<void> {
    const { items } = ctx.request.body;
    const ids = items.map(i => i.id);
    const flag = await this.adminReplyService.delete(ids);
    if (!flag) {
      ctx.status = 400;
      ctx.body = { message: `删除失败`, flag };
      return;
    }
    ctx.status = 200;
    ctx.body = { message: `删除成功`, flag };
  }
}