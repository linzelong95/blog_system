import { provide, controller, post, inject } from "midway";

@provide()
@controller("/admin/article")
export class AdminArticleController {

  @inject()
  adminArticleService;

  // @get("/list")
  // async getArticleList(ctx):Promise<void>{
  //   const articleList=this.userService.getArticleList();
  //   ctx.body=articleList;
  // }


  @post("/insert")
  @post("/update")
  async save(ctx): Promise<void> {
    const { id, title, abstract, isTop, category, user, tags, content } = ctx.request.body;
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