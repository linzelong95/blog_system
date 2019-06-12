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
const Reply_1 = require("../../entity/Reply");
let AdminReplyService = class AdminReplyService {
    constructor() {
        this.repository = typeorm_1.getRepository(Reply_1.Reply);
    }
    async list(options) {
        const { reply, orderBy, index, size, articleIdsArr, isTop, isApproved, isRoot, category: { sortIdsArr = [], cateIdsArr = [] } } = options;
        const orderByMap = {};
        if (orderBy.name && ["isApproved", "isTop", "createDate", "updateDate"].includes(orderBy.name))
            orderByMap[`reply.${orderBy.name}`] = orderBy.by;
        if (!orderBy.name || !["isTop"].includes(orderBy.name))
            orderByMap["reply.isTop"] = "DESC";
        if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name))
            orderByMap["reply.createDate"] = "ASC";
        return await this.repository
            .createQueryBuilder("reply")
            .innerJoinAndSelect("reply.article", "article")
            .innerJoin("article.category", "category")
            .innerJoin("category.sort", "sort")
            .leftJoinAndSelect("reply.from", "fromUser")
            .leftJoinAndSelect("reply.to", "toUser")
            .where("reply.reply like :reply", { reply: `%${reply}%` })
            .andWhere(articleIdsArr.length ? `reply.article in (${articleIdsArr.join(",")})` : "1=1")
            .andWhere(isApproved !== undefined ? `reply.isApproved=${isApproved}` : "1=1")
            .andWhere(isTop !== undefined ? `reply.isTop=${isTop}` : "1=1")
            .andWhere(isRoot !== undefined ? isRoot === 0 ? "reply.parentId>0" : "reply.parentId=0" : "1=1")
            .andWhere(sortIdsArr.length && !cateIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
            .andWhere(!sortIdsArr.length && cateIdsArr.length ? `category.id in (${cateIdsArr.join(",")})` : "1=1")
            .andWhere(sortIdsArr.length && cateIdsArr.length ? `sort.id in (${sortIdsArr.join(",")}) or category.id in (${cateIdsArr.join(",")})` : "1=1")
            .orderBy(orderByMap)
            .skip((index - 1) * size)
            .take(size)
            .getManyAndCount();
    }
    async save(options) {
        let flag = true;
        const replyEntity = this.repository.create(Object.assign({}, options));
        await this.repository.save(replyEntity).catch(e => { flag = false; });
        return flag;
    }
    async delete(options) {
        const { idsArr, parentIdsArr } = options;
        let flag = true;
        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .from(Reply_1.Reply)
            .where(`id in (${idsArr.join(",")}) ${parentIdsArr.length > 0 ? `or parentId in (${parentIdsArr.join(",")})` : ""}`)
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
    async approve(ids) {
        let flag = true;
        const result = await this.repository
            .createQueryBuilder()
            .update(Reply_1.Reply)
            .set({ isApproved: 1 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
    async disapprove(ids) {
        let flag = true;
        const result = await this.repository
            .createQueryBuilder()
            .update(Reply_1.Reply)
            .set({ isApproved: 0 })
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
            .update(Reply_1.Reply)
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
            .update(Reply_1.Reply)
            .set({ isTop: 0 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
};
AdminReplyService = __decorate([
    midway_1.provide()
], AdminReplyService);
exports.AdminReplyService = AdminReplyService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZS9hZG1pblNlcnZpY2UvcmVwbHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxtQ0FBaUM7QUFDakMscUNBQXdDO0FBQ3hDLDhDQUEyQztBQUkzQyxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtJQUQ5QjtRQUdFLGVBQVUsR0FBRyx1QkFBYSxDQUFDLGFBQUssQ0FBQyxDQUFDO0lBMkdwQyxDQUFDO0lBekdDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTztRQUNoQixNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUMxSSxNQUFNLFVBQVUsR0FBcUIsRUFBRSxDQUFDO1FBQ3hDLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQUUsVUFBVSxDQUFDLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNqSixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxVQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzNGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8s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