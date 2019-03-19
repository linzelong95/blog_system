import { provide } from 'midway';
import {getRepository} from "typeorm";
import {Article} from "../../entity/Article";

@provide()
export class UserArticleService  {

  async getArticleList() {
    const articleList=await getRepository(Article)
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.category","category")
      .leftJoinAndSelect("article.tags","tag")
      .leftJoinAndSelect("category.sort","sort")
      .getMany();                   
    return articleList;
  }
}
