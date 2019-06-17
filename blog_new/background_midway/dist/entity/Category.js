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
const Sort_1 = require("./Sort");
const Article_1 = require("./Article");
let Category = class Category {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Category.prototype, "isEnable", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Category.prototype, "isUsed", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Category.prototype, "createDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Category.prototype, "updateDate", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Sort_1.Sort, sort => sort.categories, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", Sort_1.Sort)
], Category.prototype, "sort", void 0);
__decorate([
    typeorm_1.OneToMany(type => Article_1.Article, article => article.category),
    __metadata("design:type", Array)
], Category.prototype, "articles", void 0);
Category = __decorate([
    typeorm_1.Entity()
], Category);
exports.Category = Category;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2F0ZWdvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50aXR5L0NhdGVnb3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEscUNBQTJIO0FBQzNILGlDQUE4QjtBQUM5Qix1Q0FBbUM7QUFHbkMsSUFBYSxRQUFRLEdBQXJCLE1BQWEsUUFBUTtDQTBCcEIsQ0FBQTtBQXZCRztJQURDLGdDQUFzQixFQUFFOztvQ0FDZDtBQUdYO0lBREMsZ0JBQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQzs7c0NBQ1o7QUFHYjtJQURDLGdCQUFNLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLENBQUM7OzBDQUNIO0FBR2pCO0lBREMsZ0JBQU0sQ0FBQyxFQUFDLE9BQU8sRUFBQyxDQUFDLEVBQUMsQ0FBQzs7d0NBQ0w7QUFHZjtJQURDLDBCQUFnQixFQUFFOzs0Q0FDQTtBQUduQjtJQURDLDBCQUFnQixFQUFFOzs0Q0FDQTtBQUduQjtJQURDLG1CQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUM7OEJBQ3hGLFdBQUk7c0NBQUM7QUFHWDtJQURDLG1CQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7MENBQ3BDO0FBeEJYLFFBQVE7SUFEcEIsZ0JBQU0sRUFBRTtHQUNJLFFBQVEsQ0EwQnBCO0FBMUJZLDRCQUFRIn0=