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
let UserSortController = class UserSortController {
    async list(ctx) {
        const { conditionQuery: { isEnable, name = "", orderBy: orderBy = {} }, index = 1, size = 10 } = ctx.request.body;
        const [list, total] = await this.userSortService.list({ isEnable, name, orderBy, index, size });
        ctx.body = { list, total };
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], UserSortController.prototype, "userSortService", void 0);
__decorate([
    midway_1.post("/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSortController.prototype, "list", null);
UserSortController = __decorate([
    midway_1.provide(),
    midway_1.controller("/user/sort")
], UserSortController);
exports.UserSortController = UserSortController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvY29udHJvbGxlci91c2VyQ29udHJvbGxlci9zb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTJEO0FBSTNELElBQWEsa0JBQWtCLEdBQS9CLE1BQWEsa0JBQWtCO0lBTTdCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRztRQUNaLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRSxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ2xILE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUVGLENBQUE7QUFUQztJQURDLGVBQU0sRUFBRTs7MkRBQ087QUFHaEI7SUFEQyxhQUFJLENBQUMsT0FBTyxDQUFDOzs7OzhDQUtiO0FBVlUsa0JBQWtCO0lBRjlCLGdCQUFPLEVBQUU7SUFDVCxtQkFBVSxDQUFDLFlBQVksQ0FBQztHQUNaLGtCQUFrQixDQVk5QjtBQVpZLGdEQUFrQiJ9