import { provide } from 'midway';
import {getRepository} from "typeorm";
import {Article} from "../../entity/Article";
import {Content} from "../../entity/Content";
import {Category} from "../../entity/Category";

@provide()
export class AdminArticleService  {

  async getArticleList() {
    const articleList=await getRepository(Article)
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.category","category")
      .leftJoinAndSelect("article.tags","tag")
      .leftJoinAndSelect("category.sort","sort")
      .getMany();                   
    return articleList;
  }

  async insert(options){
    const {title,abstract,isEnable,isTop,content,category,user}=options;

    const contentEntity=new Content();
    contentEntity.content=content;

    let categoryEntity=new Category();
    categoryEntity=category;

    const articleEntity=new Article();
    articleEntity.title=title;
    articleEntity.abstract=abstract;
    articleEntity.isEnable=isEnable;
    articleEntity.isTop=isTop;
    articleEntity.content=contentEntity;
    articleEntity.category=categoryEntity;
    articleEntity.user=user;
  }
}