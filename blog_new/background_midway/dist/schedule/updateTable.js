"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const midway_1 = require("midway");
const typeorm_1 = require("typeorm");
const Sort_1 = require("../entity/Sort");
const Tag_1 = require("../entity/Tag");
const Category_1 = require("../entity/Category");
let UpdateTable = class UpdateTable {
    constructor() {
        this.sortRepository = typeorm_1.getRepository(Sort_1.Sort);
        this.tagRepository = typeorm_1.getRepository(Tag_1.Tag);
        this.categoryRepository = typeorm_1.getRepository(Category_1.Category);
    }
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
                .update(Tag_1.Tag)
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
                .update(Category_1.Category)
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
                .update(Sort_1.Sort)
                .set({ isUsed: 0 })
                .where("id in (:...ids)", { ids: unUsedSortIds })
                .execute();
        }
    }
};
UpdateTable = __decorate([
    midway_1.provide(),
    midway_1.schedule({
        interval: 1000 * 60 * 60,
        type: "worker"
    })
], UpdateTable);
exports.UpdateTable = UpdateTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlVGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2NoZWR1bGUvdXBkYXRlVGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxtQ0FBbUU7QUFDbkUscUNBQXdDO0FBQ3hDLHlDQUFzQztBQUN0Qyx1Q0FBb0M7QUFDcEMsaURBQThDO0FBTzlDLElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVc7SUFMeEI7UUFPRSxtQkFBYyxHQUFHLHVCQUFhLENBQUMsV0FBSSxDQUFDLENBQUM7UUFDckMsa0JBQWEsR0FBRyx1QkFBYSxDQUFDLFNBQUcsQ0FBQyxDQUFDO1FBQ25DLHVCQUFrQixHQUFHLHVCQUFhLENBQUMsbUJBQVEsQ0FBQyxDQUFDO0lBaUQvQyxDQUFDO0lBL0NDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBVztRQUNwQixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhO2FBQ3JDLGtCQUFrQixDQUFDLEtBQUssQ0FBQzthQUN6QixpQkFBaUIsQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDO2FBQzdDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUMxQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRTtZQUN2QixNQUFNLElBQUksQ0FBQyxhQUFhO2lCQUNyQixrQkFBa0IsRUFBRTtpQkFDcEIsTUFBTSxDQUFDLFNBQUcsQ0FBQztpQkFDWCxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7aUJB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