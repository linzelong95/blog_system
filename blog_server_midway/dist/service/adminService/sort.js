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
const Sort_1 = require("../../entity/Sort");
let AdminSortService = class AdminSortService {
    constructor() {
        this.repository = typeorm_1.getRepository(Sort_1.Sort);
    }
    async list(options) {
        const { index, size, name, isEnable, isCateEnable, orderBy } = options;
        const orderByMap = {};
        if (orderBy.name && ["name", "isEnable", "createDate", "updateDate"].includes(orderBy.name))
            orderByMap[`sort.${orderBy.name}`] = orderBy.by;
        if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name))
            orderByMap["sort.createDate"] = "ASC";
        return await this.repository
            .createQueryBuilder("sort")
            .leftJoinAndSelect("sort.categories", "categories", isCateEnable !== undefined ? `categories.isEnable=${isCateEnable}` : "1=1")
            .where("sort.name like :name", { name: `%${name}%` })
            .andWhere(isEnable !== undefined ? `sort.isEnable=${isEnable}` : "1=1")
            .orderBy(orderByMap)
            .skip((index - 1) * size)
            .take(size)
            .getManyAndCount();
    }
    async save(options) {
        let flag = true;
        const sortEntity = this.repository.create(Object.assign({}, options));
        await this.repository.save(sortEntity).catch(e => { flag = false; });
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
            .update(Sort_1.Sort)
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
            .update(Sort_1.Sort)
            .set({ isEnable: 1 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
};
AdminSortService = __decorate([
    midway_1.provide()
], AdminSortService);
exports.AdminSortService = AdminSortService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlL2FkbWluU2VydmljZS9zb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsbUNBQWlDO0FBQ2pDLHFDQUF3QztBQUN4Qyw0Q0FBeUM7QUFJekMsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBZ0I7SUFEN0I7UUFHRSxlQUFVLEdBQUcsdUJBQWEsQ0FBQyxXQUFJLENBQUMsQ0FBQztJQThEbkMsQ0FBQztJQTVEQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDaEIsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQ3ZFLE1BQU0sVUFBVSxHQUFxQixFQUFFLENBQUM7UUFDeEMsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxVQUFVLENBQUMsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQzdJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDakgsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVO2FBQ3pCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQzthQUMxQixpQkFBaUIsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLFlBQVksRUFBRSxDQUFDLENBQUMs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