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
const Category_1 = require("../../entity/Category");
let AdminCategoryService = class AdminCategoryService {
    constructor() {
        this.repository = typeorm_1.getRepository(Category_1.Category);
    }
    async list(options) {
        const { index, size, name, isEnable, orderBy, sortIdsArr, id } = options;
        const orderByMap = {};
        if (orderBy.name && ["name", "isEnable", "sort", "createDate", "updateDate"].includes(orderBy.name))
            orderByMap[`category.${orderBy.name}`] = orderBy.by;
        if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name))
            orderByMap["category.createDate"] = "ASC";
        return await this.repository
            .createQueryBuilder("category")
            .innerJoinAndSelect("category.sort", "sort", sortIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
            .where("category.name like :name", { name: `%${name}%` })
            .andWhere(id ? `category.id=${id}` : "1=1")
            .andWhere(isEnable !== undefined ? `category.isEnable=${isEnable}` : "1=1")
            .orderBy(orderByMap)
            .skip((index - 1) * size)
            .take(size)
            .getManyAndCount();
    }
    async save(options) {
        let flag = true;
        const categoryEntity = this.repository.create(Object.assign({}, options));
        await this.repository.save(categoryEntity).catch(e => { flag = false; });
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
            .update(Category_1.Category)
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
            .update(Category_1.Category)
            .set({ isEnable: 1 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
};
AdminCategoryService = __decorate([
    midway_1.provide()
], AdminCategoryService);
exports.AdminCategoryService = AdminCategoryService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZS9hZG1pblNlcnZpY2UvY2F0ZWdvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxtQ0FBaUM7QUFDakMscUNBQXdDO0FBQ3hDLG9EQUFpRDtBQUlqRCxJQUFhLG9CQUFvQixHQUFqQyxNQUFhLG9CQUFvQjtJQURqQztRQUdFLGVBQVUsR0FBRyx1QkFBYSxDQUFDLG1CQUFRLENBQUMsQ0FBQztJQStEdkMsQ0FBQztJQTdEQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDaEIsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUN6RSxNQUFNLFVBQVUsR0FBcUIsRUFBRSxDQUFDO1FBQ3hDLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUFFLFVBQVUsQ0FBQyxZQUFZLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDekosSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUFFLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNySCxPQUFPLE1BQU0sSUFBSSxDQUFDLFVBQVU7YUFDekIsa0JBQWtCLENBQUMsVUFBVSxDQUFDO2FBQzlCLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMs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