import {WebMiddleware ,provide,config} from "midway";


@provide()
export class ApiMiddleware implements WebMiddleware{
  @config()
  hello;

  resolve(){
    return async (ctx,next)=>{
      ctx.api=this.hello;
      await next();
    }
  }
}


// export const ApiMiddleware=(data)=>async (ctx,next)=>{
//       ctx.api=data;
//       await next();
//     }