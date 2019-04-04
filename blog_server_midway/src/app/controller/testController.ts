import { provide, controller, get } from "midway";

@provide()
@controller("/test")
export class TestController {


  @get("/list")
  async list(ctx): Promise<void> {
    ctx.body = { msg:"welcome" };
  }

}