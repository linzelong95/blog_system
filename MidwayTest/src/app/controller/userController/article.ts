import {provide,controller,get,inject} from "midway";

@provide()
@controller("/user/article")
export class UserArticleController{

  @inject()
  userArticleService;
  
  @get("/list")
  async getArticleList(ctx):Promise<void>{
    const articleList=this.userArticleService.getArticleList();
    ctx.body=articleList;
  }
}