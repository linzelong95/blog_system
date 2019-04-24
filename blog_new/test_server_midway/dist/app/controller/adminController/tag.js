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
let AdminTagController = class AdminTagController {
    async list(ctx) {
        const { conditionQuery: { isEnable, name = "", orderBy = {}, sortIdsArr = [] }, index = 1, size = 10 } = ctx.request.body;
        const [list, total] = await this.adminTagService.list({ isEnable, name, orderBy, index, size, sortIdsArr });
        ctx.body = { list, total };
    }
    async save(ctx) {
        const { id, name, isEnable, sortId } = ctx.request.body;
        const flag = await this.adminTagService.save({ id, name, isEnable, sort: { id: sortId } });
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
        const flag = await this.adminTagService.delete(ids);
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
        const flag = await this.adminTagService.lock(ids);
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
        const flag = await this.adminTagService.unlock(ids);
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
], AdminTagController.prototype, "adminTagService", void 0);
__decorate([
    midway_1.post("/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTagController.prototype, "list", null);
__decorate([
    midway_1.post("/insert"),
    midway_1.post("/update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTagController.prototype, "save", null);
__decorate([
    midway_1.post("/delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTagController.prototype, "delete", null);
__decorate([
    midway_1.post("/lock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTagController.prototype, "lock", null);
__decorate([
    midway_1.post("/unlock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminTagController.prototype, "unlock", null);
AdminTagController = __decorate([
    midway_1.provide(),
    midway_1.controller("/admin/tag")
], AdminTagController);
exports.AdminTagController = AdminTagController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb250cm9sbGVyL2FkbWluQ29udHJvbGxlci90YWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBMkQ7QUFJM0QsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7SUFNN0IsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHO1FBQ1osTUFBTSxFQUFFLGNBQWMsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsVUFBVSxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzFILE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM1RyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFJRCxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7UUFDWixNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDeEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDM0YsTUFBTSxNQUFN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