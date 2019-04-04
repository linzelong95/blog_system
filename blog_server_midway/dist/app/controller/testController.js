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
let TestController = class TestController {
    async list(ctx) {
        ctx.body = { msg: "welcome" };
    }
};
__decorate([
    midway_1.get("/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "list", null);
TestController = __decorate([
    midway_1.provide(),
    midway_1.controller("/test")
], TestController);
exports.TestController = TestController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvdGVzdENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBa0Q7QUFJbEQsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBYztJQUl6QixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7UUFDWixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9CLENBQUM7Q0FFRixDQUFBO0FBSkM7SUFEQyxZQUFHLENBQUMsT0FBTyxDQUFDOzs7OzBDQUdaO0FBTlUsY0FBYztJQUYxQixnQkFBTyxFQUFFO0lBQ1QsbUJBQVUsQ0FBQyxPQUFPLENBQUM7R0FDUCxjQUFjLENBUTFCO0FBUlksd0NBQWMifQ==