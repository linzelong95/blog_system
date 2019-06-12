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
const Tag_1 = require("../../entity/Tag");
let AdminTagService = class AdminTagService {
    constructor() {
        this.repository = typeorm_1.getRepository(Tag_1.Tag);
    }
    async list(options) {
        const { index, size, name, isEnable, orderBy, sortIdsArr } = options;
        const orderByMap = {};
        if (orderBy.name && ["name", "isEnable", "sort", "createDate", "updateDate"].includes(orderBy.name))
            orderByMap[`tag.${orderBy.name}`] = orderBy.by;
        if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name))
            orderByMap["tag.createDate"] = "ASC";
        return await this.repository
            .createQueryBuilder("tag")
            .innerJoinAndSelect("tag.sort", "sort", sortIdsArr.length ? `sort.id in (${sortIdsArr.join(",")})` : "1=1")
            .where("tag.name like :name", { name: `%${name}%` })
            .andWhere(isEnable !== undefined ? `tag.isEnable=${isEnable}` : "1=1")
            .orderBy(orderByMap)
            .skip((index - 1) * size)
            .take(size)
            .getManyAndCount();
    }
    async save(options) {
        let flag = true;
        const tagEntity = this.repository.create(Object.assign({}, options));
        await this.repository.save(tagEntity).catch(e => { flag = false; });
        return { flag, entity: tagEntity };
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
            .update(Tag_1.Tag)
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
            .update(Tag_1.Tag)
            .set({ isEnable: 1 })
            .where("id in (:...ids)", { ids })
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
};
AdminTagService = __decorate([
    midway_1.provide()
], AdminTagService);
exports.AdminTagService = AdminTagService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3NlcnZpY2UvYWRtaW5TZXJ2aWNlL3RhZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLG1DQUFpQztBQUNqQyxxQ0FBd0M7QUFDeEMsMENBQXVDO0FBSXZDLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7SUFENUI7UUFHRSxlQUFVLEdBQUcsdUJBQWEsQ0FBQyxTQUFHLENBQUMsQ0FBQztJQThEbEMsQ0FBQztJQTVEQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDaEIsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQ3JFLE1BQU0sVUFBVSxHQUFxQixFQUFFLENBQUM7UUFDeEMsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQUUsVUFBVSxDQUFDLE9BQU8sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNwSixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQUUsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2hILE9BQU8sTUFBTSxJQUFJLENBQUMsVUFBVTthQUN6QixrQkFBa0IsQ0FBQyxLQUFLLENBQUM7YUFDekIsa0JBQWtCLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxlQUFlLFVBQVUsQ0FBQyxJQUFJLENBQUMs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