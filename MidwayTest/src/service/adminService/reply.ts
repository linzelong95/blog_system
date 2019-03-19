import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Reply } from "../../entity/Reply";

@provide()
export class AdminReplyService {

  repository = getRepository(Reply);

  async list(options) {
    const { reply, orderBy, index, size, articleIdsArr, isTop, isApproved, isRoot, category: { sortIdsArr = [], cateIdsArr = [] } } = options;
    let orderByName: string = "reply.isTop";
    let orderByMethod: "ASC" | "DESC" = "DESC";
    if (orderBy.name && ["createDate", "isApproved", "isTop"].includes(orderBy.name)) {
      orderByName = `reply.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    return await this.repository
      .createQueryBuilder("reply")
      .innerJoinAndSelect("reply.article", "article")
      .leftJoinAndSelect("reply.from", "fromUser")
      .leftJoinAndSelect("reply.to", "toUser")
      .where("reply.reply like :reply", { reply: `%${reply}%` })
      .andWhere(isApproved !== undefined ? `reply.isApproved=${isApproved}` : "1=1")
      .andWhere(isTop !== undefined ? `reply.isTop=${isTop}` : "1=1")
      .andWhere(isRoot !== undefined ? isRoot ? "reply.parentId>0" : "reply.parentId=0" : "1=1")
      .andWhere(articleIdsArr.lenght ? `article.id in (${articleIdsArr.join(",")})` : "1=1")
      .andWhere(sortIdsArr.length && !cateIdsArr.lenght ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
      .andWhere(!sortIdsArr.length && cateIdsArr.lenght ? `category.id in (${cateIdsArr.join(",")})` : "1=1")
      .andWhere(sortIdsArr.length && cateIdsArr.lenght ? `sort.id in (${sortIdsArr.join(",")}) or category.id in (${cateIdsArr.join(",")})` : "1=1")
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