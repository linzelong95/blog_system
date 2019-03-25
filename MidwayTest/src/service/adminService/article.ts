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
      .innerJoinAndSelect("article.category", "category")
      .innerJoinAndSelect("article.user", "user")
      .innerJoinAndSelect("category.sort", "sort")
      .leftJoinAndSelect("article.tags", "tag")
      .where("article.title like :title", { title: `%${title}%` })
      .andWhere("article.user=:userId", { userId: user.id })
      .andWhere(sortIdsArr.length && !cateIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
      .andWhere(!sortIdsArr.length && cateIdsArr.length ? `category.id in (${cateIdsArr.join(",")})` : "1=1")
      .andWhere(sortIdsArr.length && cateIdsArr.length ? `sort.id in (${sortIdsArr.join(",")}) or category.id in (${cateIdsArr.join(",")})` : "1=1")
      .orderBy(orderByName, orderByMethod)
      .skip((index - 1) * size)
      .take(size)
      .getManyAndCount();
  }

  async content(options) {
    const { articleId } = options;
    return await getRepository(Content).find({ article: articleId });
  }

  async save(options) {
    const { content, id, imageUrl = "/public/img/article/defaultimg.jpeg" } = options;
    const contentEntity = id ? await getRepository(Content).findOne({ article: id }) : {};
    let flag = true;
    const articleEntity = this.repository.create({ ...options, imageUrl, content: { ...contentEntity, content } });
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

  async lock(ids: number[]) {
    let flag = true;
    const result = await this.repository
      .createQueryBuilder()
      .update(Article)
      .set({ isEnable: 0 })
      .where("id in (:...ids)", { ids })
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
      .update(Article)
      .set({ isEnable: 1 })
      .where("id in (:...ids)", { ids })
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

  async top(ids: number[]) {
    let flag = true;
    const result = await this.repository
      .createQueryBuilder()
      .update(Article)
      .set({ isTop: 1 })
      .where("id in (:...ids)", { ids })
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

  async untop(ids: number[]) {
    let flag = true;
    const result = await this.repository
      .createQueryBuilder()
      .update(Article)
      .set({ isTop: 0 })
      .where("id in (:...ids)", { ids })
      .execute();
    if (!result.raw.affectedRows) {
      flag = false;
    }
    return flag;
  }

}