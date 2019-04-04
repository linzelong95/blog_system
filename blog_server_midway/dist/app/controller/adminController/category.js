"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const midway_1 = require("midway");
let AdminCategoryController = class AdminCategoryController {
    async list(ctx) {
        const { conditionQuery: { isEnable, name = "", orderBy = {}, sortIdsArr = [], id }, index = 1, size = 10 } = ctx.request.body;
        const [list, total] = await this.adminCategoryService.list({ isEnable, name, orderBy, index, size, sortIdsArr, id });
        ctx.body = { list, total };
    }
    async save(ctx) {
        const { id, name, isEnable, sortId } = ctx.request.body;
        const flag = await this.adminCategoryService.save({ id, name, isEnable, sort: { id: sortId } });
        const action = id ? "更新" : "添加";
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `${action}失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `${action}成功`, flag };
    }
    async delete(ctx) {
        const { items } = ctx.request.body;
        const ids = items.map(i => i.id);
        const flag = await this.adminCategoryService.delete(ids);
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `删除失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `删除成功`, flag };
    }
    async lock(ctx) {
        const { items } = ctx.request.body;
        const ids = items.map(i => i.id);
        const flag = await this.adminCategoryService.lock(ids);
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `禁用失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `禁用成功`, flag };
    }
    async unlock(ctx) {
        const { items } = ctx.request.body;
        const ids = items.map(i => i.id);
        const flag = await this.adminCategoryService.unlock(ids);
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `启用失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `启用成功`, flag };
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], AdminCategoryController.prototype, "adminCategoryService", void 0);
__decorate([
    midway_1.post("/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "list", null);
__decorate([
    midway_1.post("/insert"),
    midway_1.post("/update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "save", null);
__decorate([
    midway_1.post("/delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "delete", null);
__decorate([
    midway_1.post("/lock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "lock", null);
__decorate([
    midway_1.post("/unlock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "unlock", null);
AdminCategoryController = __decorate([
    midway_1.provide(),
    midway_1.controller("/admin/cate")
], AdminCategoryController);
exports.AdminCategoryController = AdminCategoryController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvYWRtaW5Db250cm9sbGVyL2NhdGVnb3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTJEO0FBSTNELElBQWEsdUJBQXVCLEdBQXBDLE1BQWEsdUJBQXVCO0lBTWxDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRztRQUNaLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFLFVBQVUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDOUgsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JILEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUlELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRztRQUNaLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUN4RCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxF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