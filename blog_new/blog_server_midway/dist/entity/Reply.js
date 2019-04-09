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
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Article_1 = require("./Article");
let Reply = class Reply {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Reply.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Reply.prototype, "reply", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Reply.prototype, "isApproved", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Reply.prototype, "isTop", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Reply.prototype, "parentId", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Reply.prototype, "createDate", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.froms),
    typeorm_1.JoinColumn({ name: "fromId" }),
    __metadata("design:type", User_1.User)
], Reply.prototype, "from", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.tos),
    typeorm_1.JoinColumn({ name: "toId" }),
    __metadata("design:type", User_1.User)
], Reply.prototype, "to", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Article_1.Article, article => article.replies, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", Article_1.Article)
], Reply.prototype, "article", void 0);
Reply = __decorate([
    typeorm_1.Entity()
], Reply);
exports.Reply = Reply;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50aXR5L1JlcGx5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEscUNBQTBHO0FBQzFHLGlDQUE4QjtBQUM5Qix1Q0FBbUM7QUFHbkMsSUFBYSxLQUFLLEdBQWxCLE1BQWEsS0FBSztDQStCakIsQ0FBQTtBQTVCRztJQURDLGdDQUFzQixFQUFFOztpQ0FDZDtBQUdYO0lBREMsZ0JBQU0sRUFBRTs7b0NBQ0s7QUFHZDtJQURDLGdCQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7O3lDQUNKO0FBR25CO0lBREMsZ0JBQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQzs7b0NBQ1Q7QUFHZDtJQURDLGdCQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7O3VDQUNOO0FBR2pCO0lBREMsMEJBQWdCLEVBQUU7O3lDQUNBO0FBSW5CO0lBRkMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDM0Msb0JBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQzs4QkFDekIsV0FBSTttQ0FBQztBQUlYO0lBRkMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDekMsb0JBQVUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQzs4QkFDekIsV0FBSTtpQ0FBQztBQUdUO0lBREMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUM7OEJBQzVGLGlCQUFPO3NDQUFDO0FBN0JSLEtBQUs7SUFEakIsZ0JBQU0sRUFBRTtHQUNJLEtBQUssQ0ErQmpCO0FBL0JZLHNCQUFLIn0=