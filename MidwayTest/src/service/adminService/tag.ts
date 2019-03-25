import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Tag } from "../../entity/Tag";

@provide()
export class AdminTagService {

  repository = getRepository(Tag);

  async list(options) {
    const { index, size, name, isEnable, orderBy, sortIdsArr } = options;
    let orderByName: string = "tag.createDate";
    let orderByMethod: "ASC" | "DESC" = "ASC";
    if (orderBy.name && ["name", "createDate", "updateDate", "isEnable", "sort"].includes(orderBy.name)) {
      orderByName = `tag.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    console.log(index,size)
    return await this.repository
      .createQueryBuilder("tag")
      .innerJoinAndSelect("tag.sort", "sort", sortIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
      .where("tag.name like :name", { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `tag.isEnable=${isEnable}` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip((index - 1) * size)
      .take(size)
      .getManyAndCount();
  }

  async save(options) {
    let flag = true;
    const tagEntity = this.repository.create({ ...options });
    await this.repository.save(tagEntity).catch(e => { flag = false });
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

  async lock(ids: number[]) {
    let flag = true;
    const result = await this.repository
      .createQueryBuilder()
      .update(Tag)
      .set({isEnable:0})
      .where("id in (:...ids)",{ids})
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

  async unlock(ids: number[]) {
    let flag = true;
    const result = await this.repository
      .createQueryBuilder()
      .update(Tag)
      .set({isEnable:1})
      .where("id in (:...ids)",{ids})
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

}