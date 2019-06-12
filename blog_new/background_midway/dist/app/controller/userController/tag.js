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
let userTagController = class userTagController {
    async list(ctx) {
        const { conditionQuery: { isEnable, name = "", orderBy = {}, sortIdsArr = [] }, index = 1, size = 10 } = ctx.request.body;
        const [list, total] = await this.userTagService.list({ isEnable, name, orderBy, index, size, sortIdsArr });
        ctx.body = { list, total };
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], userTagController.prototype, "userTagService", void 0);
__decorate([
    midway_1.post("/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], userTagController.prototype, "list", null);
userTagController = __decorate([
    midway_1.provide(),
    midway_1.controller("/user/tag")
], userTagController);
exports.userTagController = userTagController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC9jb250cm9sbGVyL3VzZXJDb250cm9sbGVyL3RhZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1DQUEyRDtBQUkzRCxJQUFhLGlCQUFpQixHQUE5QixNQUFhLGlCQUFpQjtJQU01QixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7UUFDWixNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUgsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzNHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUVGLENBQUE7QUFUQztJQURDLGVBQU0sRUFBRTs7eURBQ007QUFHZjtJQURDLGFBQUksQ0FBQyxPQUFPLENBQUM7Ozs7NkNBS2I7QUFWVSxpQkFBaUI7SUFGN0IsZ0JBQU8sRUFBRTtJQUNULG1CQUFVLENBQUMsV0FBVyxDQUFDO0dBQ1gsaUJBQWlCLENBWTdCO0FBWlksOENBQWlCIn0=