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
const Article_1 = require("../../entity/Article");
const Content_1 = require("../../entity/Content");
let UserArticleService = class UserArticleService {
    constructor() {
        this.repository = typeorm_1.getRepository(Article_1.Article);
    }
    async list(options) {
        const { id, index, size, title, orderBy, tagIdsArr, category: { sortIdsArr = [], cateIdsArr = [] } } = options;
        const orderByMap = { "article.isTop": "DESC" };
        if (orderBy.name && ["title", "createDate", "updateDate"].includes(orderBy.name))
            orderByMap[`article.${orderBy.name}`] = orderBy.by;
        if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name))
            orderByMap["article.createDate"] = "ASC";
        return await this.repository
            .createQueryBuilder("article")
            .innerJoinAndSelect("article.category", "category", "category.isEnable=1")
            .innerJoinAndSelect("article.user", "user")
            .innerJoinAndSelect("category.sort", "sort", "sort.isEnable=1")
            .leftJoinAndSelect("article.tags", "tag", "tag.isEnable=1")
            .where("article.title like :title", { title: `%${title}%` })
            .andWhere(qb => {
            if (!tagIdsArr.length)
                return "1=1";
            const subQuery = qb
                .subQuery()
                .select("article.id")
                .from(Article_1.Article, "article")
                .innerJoin("article.tags", "tag", `tag.id in (:...tagIdsArr)`, { tagIdsArr })
                .getQuery();
            return `article.id in ${subQuery}`;
        })
            .andWhere(id ? `article.id=${id}` : "1=1")
            .andWhere("article.isEnable=1")
            .andWhere(sortIdsArr.length && !cateIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
            .andWhere(!sortIdsArr.length && cateIdsArr.length ? `category.id in (${cateIdsArr.join(",")})` : "1=1")
            .andWhere(sortIdsArr.length && cateIdsArr.length ? `sort.id in (${sortIdsArr.join(",")}) or category.id in (${cateIdsArr.join(",")})` : "1=1")
            .orderBy(orderByMap)
            .skip((index - 1) * size)
            .take(size)
            .getManyAndCount();
    }
    async content(options) {
        const { articleId } = options;
        return await typeorm_1.getRepository(Content_1.Content).find({ article: articleId });
    }
};
UserArticleService = __decorate([
    midway_1.provide()
], UserArticleService);
exports.UserArticleService = UserArticleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlL3VzZXJTZXJ2aWNlL2FydGljbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxtQ0FBaUM7QUFDakMscUNBQXdDO0FBQ3hDLGtEQUErQztBQUMvQyxrREFBK0M7QUFLL0MsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFEL0I7UUFHRSxlQUFVLEdBQUcsdUJBQWEsQ0FBQyxpQkFBTyxDQUFDLENBQUM7SUF3Q3RDLENBQUM7SUF0Q0MsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQ2hCLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUMvRyxNQUFNLFVBQVUsR0FBcUIsRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDakUsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUFFLFVBQVUsQ0FBQyxXQUFXLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDckksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUFFLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNwSCxPQUFPLE1BQU0sSUFBSSxDQUFDLFVBQVU7YUFDekIsa0JBQWtCLENBQUMsU0FBUyxDQUFDO2FBQzdCLGtC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