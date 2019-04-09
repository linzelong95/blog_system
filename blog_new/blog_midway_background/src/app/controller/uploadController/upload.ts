import { provide, controller, post } from "midway";
import * as fs from "fs";
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

@provide()
@controller("/upload")
export class UploadController {


  @post("/file")
  async upload(ctx): Promise<void> {
    const stream=await ctx.getFileStream();
    const filename=`${Date.now()}${stream.filename}`;
    const target=`${ctx.app.baseDir}/app/public/img/article/${filename}`;
    const writeStream = fs.createWriteStream(target);
    try{
      await awaitWriteStream(stream.pipe(writeStream));
    }finally{
      await sendToWormhole(stream);
    }
    ctx.body = { url: `/public/img/article/${filename}`};
  }
}