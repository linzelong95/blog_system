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
let UserSortService = class UserSortService {
    constructor() {
        this.repository = typeorm_1.getRepository(Sort_1.Sort);
    }
    async list(options) {
        const { index, size, name, isEnable, orderBy } = options;
        const orderByMap = {};
        if (orderBy.name && ["name", "isEnable", "createDate", "updateDate"].includes(orderBy.name))
            orderByMap[`sort.${orderBy.name}`] = orderBy.by;
        if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name))
            orderByMap["sort.createDate"] = "ASC";
        return await this.repository
            .createQueryBuilder("sort")
            .leftJoinAndSelect("sort.categories", "categories")
            .where("sort.name like :name", { name: `%${name}%` })
            .andWhere(isEnable !== undefined ? `sort.isEnable=${isEnable}` : "1=1")
            .orderBy(orderByMap)
            .skip((index - 1) * size)
            .take(size)
            .getManyAndCount();
    }
};
UserSortService = __decorate([
    midway_1.provide()
], UserSortService);
exports.UserSortService = UserSortService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlL3VzZXJTZXJ2aWNlL3NvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxtQ0FBaUM7QUFDakMscUNBQXdDO0FBQ3hDLDRDQUF5QztBQUl6QyxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0lBRDVCO1FBR0UsZUFBVSxHQUFHLHVCQUFhLENBQUMsV0FBSSxDQUFDLENBQUM7SUFrQm5DLENBQUM7SUFoQkMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQ2hCLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQ3pELE1BQU0sVUFBVSxHQUFxQixFQUFFLENBQUM7UUFDeEMsSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxVQUFVLENBQUMsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQzdJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDakgsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVO2FBQ3pCLGtCQUFrQixDQUFDLE1BQU0sQ0FBQzthQUMxQixpQkFBaUIsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUM7YUFDbEQsS0FBSyxDQUFDLHNCQUFzQixFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQzthQUNwRCxRQUFRLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDdEUsT0FBTyxDQUFDLFVBQVUsQ0FBQzthQUNuQixJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDVixlQUFlLEVBQUUsQ0FBQztJQUN2QixDQUFDO0NBRUYsQ0FBQTtBQXBCWSxlQUFlO0lBRDNCLGdCQUFPLEVBQUU7R0FDRyxlQUFlLENBb0IzQjtBQXBCWSwwQ0FBZSJ9