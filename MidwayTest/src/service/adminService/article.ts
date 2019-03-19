import { provide } from 'midway';
import { getRepository } from "typeorm";
import { Article } from "../../entity/Article";
import { Content } from "../../entity/Content";
// import {Category} from "../../entity/Category";

@provide()
export class AdminArticleService {

  repository = getRepository(Article);

  async getArticleList() {
    const articleList = await this.repository
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.category", "category")
      .leftJoinAndSelect("article.tags", "tag")
      .leftJoinAndSelect("category.sort", "sort")
      .getMany();
    return articleList;
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