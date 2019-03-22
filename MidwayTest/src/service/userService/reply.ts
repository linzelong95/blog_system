import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Reply } from "../../entity/Reply";

@provide()
export class UserReplyService {

  repository = getRepository(Reply);

  async list(options) {
    const { reply, orderBy, index, size, articleIdsArr, isTop, isApproved } = options;
    let orderByName: string = "reply.isTop";
    let orderByMethod: "ASC" | "DESC" = "DESC";
    if (orderBy.name && ["createDate", "isApproved", "isTop"].includes(orderBy.name)) {
      orderByName = `reply.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    return await this.repository
      .createQueryBuilder("reply")
      .leftJoinAndSelect("reply.from", "fromUser")
      .leftJoinAndSelect("reply.to", "toUser")
      .where("reply.reply like :reply", { reply: `%${reply}%` })
      .andWhere(articleIdsArr.length? `reply.article in (${articleIdsArr.join(",")})` : "1=1")
      .andWhere(isApproved !== undefined ? `reply.isApproved=${isApproved}` : "1=1")
      .andWhere(isTop !== undefined ? `reply.isTop=${isTop}` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip(index - 1)
      .take(size)
      .getManyAndCount();
  }

  async save(options) {
    let flag = true;
    const replyEntity = this.repository.create({ ...options });
    await this.repository.save(replyEntity).catch(e => { flag = false });
    return flag;
  }

  async delete(ids: number[]) {
    let flag = true;
    const result = await this.repository.delete(ids);
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }
}