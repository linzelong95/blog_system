import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Sort } from "../../entity/Sort";


@provide()
export class AdminSortService {

  repository = getRepository(Sort);

  async list(options) {
    const { index, size, name, isEnable, isCateEnable, orderBy } = options;
    let orderByName: string = "sort.createDate";
    let orderByMethod: "ASC" | "DESC" = "ASC";
    if (orderBy.name && ["name", "createDate", "updateDate", "isEnable"].includes(orderBy.name)) {
      orderByName = `sort.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    return await this.repository
      .createQueryBuilder("sort")
      .leftJoinAndSelect("sort.categories", "categories", isCateEnable !== undefined ? `categories.isEnable=${isCateEnable}` : "1=1")
      .where("sort.name like :name", { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `sort.isEnable=${isEnable}` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip(index - 1)
      .take(size)
      .getManyAndCount();
  }

  async save(options) {
    let flag = true;
    const sortEntity = this.repository.create({ ...options });
    await this.repository.save(sortEntity).catch(e => { flag = false });
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
      .update(Sort)
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
      .update(Sort)
      .set({isEnable:1})
      .where("id in (:...ids)",{ids})
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

}