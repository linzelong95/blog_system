import { provide, schedule, CommonSchedule } from "midway";
import { getRepository } from "typeorm";
import { Sort } from "../entity/Sort";
import { Tag } from "../entity/Tag";
import { Category } from "../entity/Category";

@provide()
@schedule({
  interval:1000*60*60,// 一个小时
  type: "worker"
})
export class UpdateTable implements CommonSchedule {

  sortRepository = getRepository(Sort);
  tagRepository = getRepository(Tag);
  categoryRepository = getRepository(Category);

  async exec(ctx) {
    const tagsArr = await this.tagRepository
      .createQueryBuilder("tag")
      .leftJoinAndSelect("tag.articles", "articles")
      .where("tag.isUsed=:isUsed", { isUsed: 1 })
      .getMany();
    const unUsedTagIds = tagsArr.filter(tag => !tag.articles.length).map(item => item.id);
    if (unUsedTagIds.length) {
      await this.tagRepository
        .createQueryBuilder()
        .update(Tag)
        .set({ isUsed: 0 })
        .where("id in (:...ids)", { ids: unUsedTagIds })
        .execute();
    }

    const categoriesArr = await this.categoryRepository
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.articles", "articles")
      .where("category.isUsed=:isUsed", { isUsed: 1 })
      .getMany();
    const unUsedCategoryIds = categoriesArr.filter(category => !category.articles.length).map(item => item.id);
    if (unUsedCategoryIds.length) {
      await this.categoryRepository
        .createQueryBuilder()
        .update(Category)
        .set({ isUsed: 0 })
        .where("id in (:...ids)", { ids: unUsedCategoryIds })
        .execute();
    }

    const sortsArr = await this.sortRepository
      .createQueryBuilder("sort")
      .leftJoinAndSelect("sort.categories", "categories", "categories.isUsed=1")
      .leftJoinAndSelect("sort.tags", "tags", "tags.isUsed=1")
      .where("sort.isUsed=:isUsed", { isUsed: 1 })
      .getMany();
    const unUsedSortIds = sortsArr.filter(sort => !sort.categories.length && !sort.tags.length).map(item => item.id);
    if (unUsedSortIds.length) {
      await this.sortRepository
        .createQueryBuilder()
        .update(Sort)
        .set({ isUsed: 0 })
        .where("id in (:...ids)", { ids: unUsedSortIds })
        .execute();
    }
  }
}