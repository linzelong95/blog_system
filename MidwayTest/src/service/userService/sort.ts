import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Sort } from "../../entity/Sort";


@provide()
export class UserSortService {

  repository = getRepository(Sort);

  async list(options) {
    const { index, size, name, isEnable, orderBy } = options;
    let orderByName: string = "sort.createDate";
    let orderByMethod: "ASC" | "DESC" = "ASC";
    if (orderBy.name && ["name", "createDate", "updateDate", "isEnable"].includes(orderBy.name)) {
      orderByName = `sort.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    return await this.repository
      .createQueryBuilder("sort")
      .leftJoinAndSelect("sort.categories","categories")
      .where("sort.name like :name", { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `sort.isEnable=${isEnable}` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip(index - 1)
      .take(size)
      .getManyAndCount();
  }

}