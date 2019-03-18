import {provide,controller,post,inject} from "midway";

@provide()
@controller("/admin/article")
export class AdminArticleController{

  @inject()
  adminArticleService;
  
  // @get("/list")
  // async getArticleList(ctx):Promise<void>{
  //   const articleList=this.userService.getArticleList();
  //   ctx.body=articleList;
  // }

  @post("/insert")
  async insert(ctx):Promise<void>{
    this.adminArticleService.insert(ctx);
    ctx.body={};
  }
}