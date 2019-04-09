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
let UserArticleController = class UserArticleController {
    async list(ctx) {
        const { conditionQuery: { title = "", orderBy = {}, category = {}, tagIdsArr = [], id }, index = 1, size = 10 } = ctx.request.body;
        const [list, total] = await this.userArticleService.list({ id, title, orderBy, index, size, category, tagIdsArr });
        ctx.body = { list, total };
    }
    async content(ctx) {
        const { articleId } = ctx.request.body;
        const content = await this.userArticleService.content({ articleId });
        ctx.body = { "list": content };
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserArticleController.prototype, "userArticleService", void 0);
__decorate([
    midway_1.post("/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserArticleController.prototype, "list", null);
__decorate([
    midway_1.post("/content"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserArticleController.prototype, "content", null);
UserArticleController = __decorate([
    midway_1.provide(),
    midway_1.controller("/user/article")
], UserArticleController);
exports.UserArticleController = UserArticleController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci91c2VyQ29udHJvbGxlci9hcnRpY2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTJEO0FBSTNELElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBTWhDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRztRQUNaLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsUUFBUSxHQUFHLEVBQUUsRUFBRSxTQUFTLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ25JLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNuSCxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFHRCxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUc7UUFDZixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDdkMsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNyRSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQ2pDLENBQUM7Q0FFRixDQUFBO0FBaEJDO0lBREMsZUFBTSxFQUFFOztpRUFDVTtBQUduQjtJQURDLGFBQUksQ0FBQyxPQUFPLENBQUM7Ozs7aURBS2I7QUFHRDtJQURDLGFBQUksQ0FBQyxVQUFVLENBQUM7Ozs7b0RBS2hCO0FBakJVLHFCQUFxQjtJQUZqQyxnQkFBTyxFQUFFO0lBQ1QsbUJBQVUsQ0FBQyxlQUFlLENBQUM7R0FDZixxQkFBcUIsQ0FtQmpDO0FBbkJZLHNEQUFxQiJ9