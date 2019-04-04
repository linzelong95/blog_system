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
let AdminArticleController = class AdminArticleController {
    async list(ctx) {
        const user = ctx.state.user;
        const { conditionQuery: { title = "", orderBy = {}, category = {} }, index = 1, size = 10 } = ctx.request.body;
        const [list, total] = await this.adminArticleService.list({ title, orderBy, index, size, category, user });
        ctx.body = { list, total };
    }
    async content(ctx) {
        const { articleId } = ctx.request.body;
        const content = await this.adminArticleService.content({ articleId });
        ctx.body = { "list": content };
    }
    async save(ctx) {
        const user = ctx.state.user;
        const { id, title, abstract, isTop, category, tags, content, imageUrl } = ctx.request.body;
        const flag = await this.adminArticleService.save({ id, title, abstract, isTop, category, user, tags, content, imageUrl });
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
        const flag = await this.adminArticleService.delete(ids);
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
        const flag = await this.adminArticleService.lock(ids);
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
        const flag = await this.adminArticleService.unlock(ids);
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `启用失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `启用成功`, flag };
    }
    async top(ctx) {
        const { items } = ctx.request.body;
        const ids = items.map(i => i.id);
        const flag = await this.adminArticleService.top(ids);
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `置顶失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `置顶成功`, flag };
    }
    async untop(ctx) {
        const { items } = ctx.request.body;
        const ids = items.map(i => i.id);
        const flag = await this.adminArticleService.untop(ids);
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `取置失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `取置成功`, flag };
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], AdminArticleController.prototype, "adminArticleService", void 0);
__decorate([
    midway_1.post("/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminArticleController.prototype, "list", null);
__decorate([
    midway_1.post("/content"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminArticleController.prototype, "content", null);
__decorate([
    midway_1.post("/insert"),
    midway_1.post("/update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminArticleController.prototype, "save", null);
__decorate([
    midway_1.post("/delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminArticleController.prototype, "delete", null);
__decorate([
    midway_1.post("/lock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminArticleController.prototype, "lock", null);
__decorate([
    midway_1.post("/unlock"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminArticleController.prototype, "unlock", null);
__decorate([
    midway_1.post("/top"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminArticleController.prototype, "top", null);
__decorate([
    midway_1.post("/untop"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminArticleController.prototype, "untop", null);
AdminArticleController = __decorate([
    midway_1.provide(),
    midway_1.controller("/admin/article")
], AdminArticleController);
exports.AdminArticleController = AdminArticleController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci9hZG1pbkNvbnRyb2xsZXIvYXJ0aWNsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1DQUEyRDtBQUkzRCxJQUFhLHNCQUFzQixHQUFuQyxNQUFhLHNCQUFzQjtJQU1qQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7UUFDWixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUM1QixNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxHQUFHLEVBQUUsRUFBRSxPQUFPLEdBQUcsRUFBRSxFQUFFLFFBQVEsR0FBRyxFQUFFLEVBQUUsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMvRyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzRyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUc7UUFDZixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDdkMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUN0RSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxD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