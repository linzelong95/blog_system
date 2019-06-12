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
let AdminArticleService = class AdminArticleService {
    constructor() {
        this.repository = typeorm_1.getRepository(Article_1.Article);
    }
    async list(options) {
        const { index, size, title, orderBy, user, category: { sortIdsArr = [], cateIdsArr = [] }, tagIdsArr } = options;
        const orderByMap = {};
        if (orderBy.name && ["title", "createDate", "updateDate"].includes(orderBy.name))
            orderByMap[`article.${orderBy.name}`] = orderBy.by;
        if (!orderBy.name || !["isTop"].includes(orderBy.name))
            orderByMap["article.isTop"] = "DESC";
        if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name))
            orderByMap["article.createDate"] = "ASC";
        return await this.repository
            .createQueryBuilder("article")
            .innerJoinAndSelect("article.category", "category")
            .innerJoinAndSelect("article.user", "user")
            .innerJoinAndSelect("category.sort", "sort")
            .leftJoinAndSelect("article.tags", "tag")
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
            .andWhere("article.user=:userId", { userId: user.id })
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
    async save(options) {
        const { content, id, imageUrl = "/public/img/article/defaultimg.jpeg" } = options;
        const contentEntity = id ? await typeorm_1.getRepository(Content_1.Content).findOne({ article: id }) : {};
        let flag = true;
        const articleEntity = this.repository.create(Object.assign({}, options, { imageUrl, content: Object.assign({}, contentEntity, { content }) }));
        await this.repository.save(articleEntity).catch(e => { flag = false; });
        return flag;
    }
    async delete(ids) {
        let flag = true;
        const result = await this.repository.delete(ids);
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
    async lock(ids) {
        let flag = true;
        const result = await this.repository
            .createQueryBuilder()
            .update(Article_1.Article)
            .set({ isEnable: 0 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
    async unlock(ids) {
        let flag = true;
        const result = await this.repository
            .createQueryBuilder()
            .update(Article_1.Article)
            .set({ isEnable: 1 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
    async top(ids) {
        let flag = true;
        const result = await this.repository
            .createQueryBuilder()
            .update(Article_1.Article)
            .set({ isTop: 1 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
    async untop(ids) {
        let flag = true;
        const result = await this.repository
            .createQueryBuilder()
            .update(Article_1.Article)
            .set({ isTop: 0 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
};
AdminArticleService = __decorate([
    midway_1.provide()
], AdminArticleService);
exports.AdminArticleService = AdminArticleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlL2FkbWluU2VydmljZS9hcnRpY2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsbUNBQWlDO0FBQ2pDLHFDQUF3QztBQUN4QyxrREFBK0M7QUFDL0Msa0RBQStDO0FBSS9DLElBQWEsbUJBQW1CLEdBQWhDLE1BQWEsbUJBQW1CO0lBRGhDO1FBR0UsZUFBVSxHQUFHLHVCQUFhLENBQUMsaUJBQU8sQ0FBQyxDQUFDO0lBa0h0QyxDQUFDO0lBaEhDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTztRQUNoQixNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUUsRUFBQyxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDaEgsTUFBTSxVQUFVLEdBQXFCLEVBQUUsQ0FBQztRQUN4QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQUUsVUFBVSxDQUFDLFdBQVcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNySSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzdGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENB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