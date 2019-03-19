import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Category } from "../../entity/Category";

@provide()
export class AdminCategoryService {

  repository = getRepository(Category);

  async get(options) {
    const { index, size, name, isEnable, orderBy, sortIdsArr } = options;
    let orderByName: string = "category.createDate";
    let orderByMethod: "ASC" | "DESC" = "ASC";
    if (orderBy.name && ["name", "createDate", "updateDate", "isEnable", "sortId"].includes(orderBy.name)) {
      orderByName = `category.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    const listAndCount = await this.repository
      .createQueryBuilder("category")
      .innerJoinAndSelect("category.sort", "sort", sortIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
      .where("category.name like :name", { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `category.isEnable=${isEnable}` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip(index - 1)
      .take(size)
      .getManyAndCount();
    return listAndCount;
  }

  async save(options) {
    let flag = true;
    const categoryEntity = this.repository.create({ ...options });
    await this.repository.save(categoryEntity).catch(e => { flag = false });
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