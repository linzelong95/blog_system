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
      .innerJoinAndSelect("reply.article","article")
      .innerJoin("article.category","category")
      .innerJoin("category.sort","sort")
      .leftJoinAndSelect("reply.from", "fromUser")
      .leftJoinAndSelect("reply.to", "toUser")
      .where("reply.reply like :reply", { reply: `%${reply}%` })
      .andWhere(articleIdsArr.length? `reply.article in (${articleIdsArr.join(",")})` : "1=1")
      .andWhere(isApproved !== undefined ? `reply.isApproved=${isApproved}` : "1=1")
      .andWhere(isTop !== undefined ? `reply.isTop=${isTop}` : "1=1")
      .andWhere(isRoot !== undefined ? isRoot===0 ? "reply.parentId>0" : "reply.parentId=0" : "1=1")
      .andWhere(sortIdsArr.length && !cateIdsArr.length? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
      .andWhere(!sortIdsArr.length && cateIdsArr.length? `category.id in (${cateIdsArr.join(",")})` : "1=1")
      .andWhere(sortIdsArr.length && cateIdsArr.length? `sort.id in (${sortIdsArr.join(",")}) or category.id in (${cateIdsArr.join(",")})` : "1=1")
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

  async delete(options) {
    const {idsArr,parentIdsArr}=options;
    let flag = true;
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Reply)
      .where(`id in (${idsArr.join(",")}) ${parentIdsArr.length>0?`or parentId in (${parentIdsArr.join(",")})`:""}`)
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

  async approve(ids: number[]) {
    let flag = true;
    const result = await this.repository
      .createQueryBuilder()
      .update(Reply)
      .set({isApproved:1})
      .where("id in (:...ids)",{ids})
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

  async disapprove(ids: number[]) {
    let flag = true;
    const result = await this.repository
      .createQueryBuilder()
      .update(Reply)
      .set({isApproved:0})
      .where("id in (:...ids)",{ids})
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

}