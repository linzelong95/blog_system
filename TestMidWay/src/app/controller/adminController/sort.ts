import {provide,controller,post,inject} from "midway";

@provide()
@controller("/admin/sort")
export class AdminSortController{

  @inject()
  adminSortService;
  
  @post("/list")
  async get(ctx):Promise<void>{
    const { conditionQuery: { isEnable, name = "", orderBy:preOrderBy = {} }, index = 1, size = 10 } = ctx.request.body;
    const orderBy=preOrderBy.name&&["name", "createDate", "updateDate", "isEnable"].includes(preOrderBy.name)?preOrderBy:{name:"createDate",by:"ASC"};
    const [list,count]=await this.adminSortService.get({isEnable,name,orderBy,index,size});
    ctx.body={list,count};
  }

  @post("/insert")
  @post("/update")
  async save(ctx):Promise<void>{
    const {id,name,isEnable}=ctx.request.body;
    const flag=await this.adminSortService.save({id,name,isEnable});
    const action=id?"更新":"添加";
    if(!flag){
      ctx.status=400;
      ctx.body={message:`${action}失败`,flag};
      return;
    }
    ctx.status=200;
    ctx.body={message:`${action}成功`,flag};
  }

  @post("/delete")
  async delete(ctx):Promise<void>{
    const {items}=ctx.request.body;
    const ids=items.map(i=>i.id);
    const flag=await this.adminSortService.delete(ids);
    if(!flag){
      ctx.status=400;
      ctx.body={message:`删除失败`,flag};
      return;
    }
    ctx.status=200;
    ctx.body={message:`删除成功`,flag};
  }
}