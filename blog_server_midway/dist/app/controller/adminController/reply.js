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
let AdminReplyController = class AdminReplyController {
    async list(ctx) {
        const { conditionQuery: { reply = "", orderBy = {}, category = {}, articleIdsArr = [], isTop, isApproved, isRoot }, index = 1, size = 10, prettyFormat } = ctx.request.body;
        const [list, total] = await this.adminReplyService.list({ reply, orderBy, index, size, category, articleIdsArr, isTop, isApproved, isRoot });
        let newList = [...list];
        if (prettyFormat) {
            const parentArr = [];
            const sonArr = [];
            list.forEach(i => {
                if (!i.parentId) {
                    parentArr.push(Object.assign({}, i, { children: [] }));
                }
                else {
                    sonArr.push(i);
                }
            });
            newList = parentArr.map(i => {
                sonArr.forEach(v => {
                    if (v.parentId === i.id)
                        i.children = [...i.children, v];
                });
                return i;
            });
        }
        ctx.body = { list: newList, total };
    }
    async save(ctx) {
        const { user: { id: userId } } = ctx.state;
        const { id, reply, parentId = 0, fromId = userId, toId = userId, articleId, isApproved = 1 } = ctx.request.body;
        const flag = await this.adminReplyService.save({ id, reply, parentId, from: { id: fromId }, to: { id: toId }, isApproved, article: { id: articleId } });
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
        const idsArr = items.map(i => i.id);
        const parentIdsArr = [];
        items.forEach(i => {
            if (i.parentId === 0)
                parentIdsArr.push(i.id);
        });
        const flag = await this.adminReplyService.delete({ idsArr, parentIdsArr });
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `删除失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `删除成功`, flag };
    }
    async approve(ctx) {
        const { items } = ctx.request.body;
        const ids = items.map(i => i.id);
        const flag = await this.adminReplyService.approve(ids);
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `操作失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `评论已通过`, flag };
    }
    async disapprove(ctx) {
        const { items } = ctx.request.body;
        const ids = items.map(i => i.id);
        const flag = await this.adminReplyService.disapprove(ids);
        if (!flag) {
            ctx.status = 400;
            ctx.body = { message: `操作失败`, flag };
            return;
        }
        ctx.status = 200;
        ctx.body = { message: `评论已设置为不通过`, flag };
    }
};
__decorate([
    midway_1.inject(),
    __metadata("design:type", Object)
], AdminReplyController.prototype, "adminReplyService", void 0);
__decorate([
    midway_1.post("/list"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminReplyController.prototype, "list", null);
__decorate([
    midway_1.post("/insert"),
    midway_1.post("/update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminReplyController.prototype, "save", null);
__decorate([
    midway_1.post("/delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminReplyController.prototype, "delete", null);
__decorate([
    midway_1.post("/approve"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminReplyController.prototype, "approve", null);
__decorate([
    midway_1.post("/disapprove"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminReplyController.prototype, "disapprove", null);
AdminReplyController = __decorate([
    midway_1.provide(),
    midway_1.controller("/admin/reply")
], AdminReplyController);
exports.AdminReplyController = AdminReplyController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL2NvbnRyb2xsZXIvYWRtaW5Db250cm9sbGVyL3JlcGx5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTJEO0FBSTNELElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0lBTS9CLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRztRQUNaLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxFQUFFLEVBQUUsUUFBUSxHQUFHLEVBQUUsRUFBRSxhQUFhLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLFlBQVksRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQzVLLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQzdJLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUN4QixJQUFJLFlBQVksRUFBRTtZQUNoQixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7WUFDckIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUU7b0JBQ2YsU0FBUyxDQUFDLElBQUksbUJBQU0sQ0FBQyxJQUFFLFFBQVEsRUFBRSxFQUFF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