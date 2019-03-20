import { provide, controller, post, inject } from "midway";

@provide()
@controller("/admin/article")
export class AdminArticleController {

  @inject()
  adminArticleService;

  @post("/list")
  async list(ctx): Promise<void> {
    //user form ssession
    const user = { id: 1 };
    const { conditionQuery: { title = "", orderBy = {}, category = {} }, index = 1, size = 10 } = ctx.request.body;
    const [list, total] = await this.adminArticleService.list({ title, orderBy, index, size, category, user });
    ctx.body = { list, total };
  }


  @post("/content")
  async content(ctx){
    const {id}=ctx.request.body;
    const content = await this.adminArticleService.content({ id });
    ctx.body={"list":content};
  }

  @post("/insert")
  @post("/update")
  async save(ctx): Promise<void> {
    //user form ssession
    const user = {};
    const { id, title, abstract, isTop, category, tags, content } = ctx.request.body;
    const flag = await this.adminArticleService.save({ id, title, abstract, isTop, category, user, tags, content });
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
    const flag = await this.adminArticleService.delete(ids);
    if (!flag) {
      ctx.status = 400;
      ctx.body = { message: `删除失败`, flag };
      return;
    }
    ctx.status = 200;
    ctx.body = { message: `删除成功`, flag };
  }
}