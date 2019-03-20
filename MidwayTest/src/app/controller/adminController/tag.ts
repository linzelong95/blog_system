import { provide, controller, post, inject } from "midway";

@provide()
@controller("/admin/tag")
export class AdmiTagController {

  @inject()
  adminTagService;

  @post("/list")
  async list(ctx): Promise<void> {
    const { conditionQuery: { isEnable, name = "", orderBy = {}, sortIdsArr = [] }, index = 1, size = 10 } = ctx.request.body;
    const [list, count] = await this.adminTagService.list({ isEnable, name, orderBy, index, size, sortIdsArr });
    ctx.body = { list, count };
  }

  @post("/insert")
  @post("/update")
  async save(ctx): Promise<void> {
    const { id, name, isEnable, sort } = ctx.request.body;
    const flag = await this.adminTagService.save({ id, name, isEnable, sort });
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
    const flag = await this.adminTagService.delete(ids);
    if (!flag) {
      ctx.status = 400;
      ctx.body = { message: `删除失败`, flag };
      return;
    }
    ctx.status = 200;
    ctx.body = { message: `删除成功`, flag };
  }
}