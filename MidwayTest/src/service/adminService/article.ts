import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Article } from "../../entity/Article";
import { Content } from "../../entity/Content";

@provide()
export class AdminArticleService {

  repository = getRepository(Article);

  async list(options) {
    const { index, size, title, orderBy, user, category: { sortIdsArr = [], cateIdsArr = [] } } = options;
    let orderByName: string = "article.isTop";
    let orderByMethod: "ASC" | "DESC" = "DESC";
    if (orderBy.name && ["title", "createDate", "updateDate", "isTop"].includes(orderBy.name)) {
      orderByName = `article.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    return await this.repository
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.category", "category", "category.isEnable=1")
      .leftJoinAndSelect("category.sort", "sort", "sort.isEnable=1")
      .leftJoinAndSelect("article.tags", "tag")
      .where("article.title like :title", { title: `%${title}%` })
      .andWhere("article.user=:userId", { userId: user.id })
      .andWhere(sortIdsArr.length && !cateIdsArr.lenght ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
      .andWhere(!sortIdsArr.length && cateIdsArr.lenght ? `category.id in (${cateIdsArr.join(",")})` : "1=1")
      .andWhere(sortIdsArr.length && cateIdsArr.lenght ? `sort.id in (${sortIdsArr.join(",")}) or category.id in (${cateIdsArr.join(",")})` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip(index - 1)
      .take(size)
      .getManyAndCount();
  }

  async save(options) {
    const { content, id } = options;
    const contentEntity = id ? await getRepository(Content).findOne({ article: id }) : {};
    let flag = true;
    const articleEntity = this.repository.create({ ...options, content: { ...contentEntity, content } });
    await this.repository.save(articleEntity).catch(e => { flag = false });
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