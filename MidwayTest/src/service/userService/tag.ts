import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Tag } from "../../entity/Tag";

@provide()
export class UserTagService {

  repository = getRepository(Tag);

  async list(options) {
    const { index, size, name, isEnable, orderBy, sortIdsArr } = options;
    let orderByName: string = "tag.createDate";
    let orderByMethod: "ASC" | "DESC" = "ASC";
    if (orderBy.name && ["name", "createDate", "updateDate", "isEnable", "sortId"].includes(orderBy.name)) {
      orderByName = `tag.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    return await this.repository
      .createQueryBuilder("tag")
      .innerJoinAndSelect("tag.sort", "sort", sortIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
      .where("tag.name like :name", { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `tag.isEnable=${isEnable}` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip(index - 1)
      .take(size)
      .getManyAndCount();
  }

}