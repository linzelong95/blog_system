import { provide } from 'midway';
import {getRepository} from "typeorm";
import {Article} from "../../entity/Article";
import { Content } from "../../entity/Content";

@provide()
export class UserArticleService  {

  repository = getRepository(Article);

  async list(options) {
    const {id, index, size, title, orderBy, tagIdsArr,category: { sortIdsArr = [], cateIdsArr = [] } } = options;
    let orderByName: string = "article.isTop";
    let orderByMethod: "ASC" | "DESC" = "DESC";
    if (orderBy.name && ["title", "createDate", "updateDate", "isTop"].includes(orderBy.name)) {
      orderByName = `article.${orderBy.name}`;
      orderByMethod = orderBy.by;
    }
    return await this.repository
      .createQueryBuilder("article")
      .innerJoinAndSelect("article.category", "category", "category.isEnable=1")
      .innerJoinAndSelect("article.user", "user")
      .innerJoinAndSelect("category.sort", "sort", "sort.isEnable=1")
      .innerJoinAndSelect("article.tags", "tag", `tag.isEnable=1 and ${tagIdsArr.length?`tag.id in (${tagIdsArr.join(",")})`:"1=1"}`)
      .where("article.title like :title", { title: `%${title}%` })
      .andWhere(id?`article.id=${id}`:"1=1")
      .andWhere(sortIdsArr.length && !cateIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
      .andWhere(!sortIdsArr.length && cateIdsArr.length ? `category.id in (${cateIdsArr.join(",")})` : "1=1")
      .andWhere(sortIdsArr.length && cateIdsArr.length ? `sort.id in (${sortIdsArr.join(",")}) or category.id in (${cateIdsArr.join(",")})` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip(index - 1)
      .take(size)
      .getManyAndCount();
  }

  async content(options) {
    const { articleId } = options;
    return await getRepository(Content).find({ article: articleId });
  }

}
