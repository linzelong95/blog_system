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
const Category_1 = require("./Category");
const User_1 = require("./User");
const Content_1 = require("./Content");
const Tag_1 = require("./Tag");
const Reply_1 = require("./Reply");
let Article = class Article {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Article.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Article.prototype, "abstract", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Article.prototype, "imageUrl", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Article.prototype, "isEnable", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Article.prototype, "createDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Article.prototype, "updateDate", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "isTop", void 0);
__decorate([
    typeorm_1.OneToOne(type => Content_1.Content, content => content.article, { cascade: true }),
    __metadata("design:type", Content_1.Content)
], Article.prototype, "content", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Category_1.Category, category => category.articles, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", Category_1.Category)
], Article.prototype, "category", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.articles),
    __metadata("design:type", User_1.User)
], Article.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Tag_1.Tag, tag => tag.articles),
    __metadata("design:type", Array)
], Article.prototype, "tags", void 0);
__decorate([
    typeorm_1.OneToMany(type => Reply_1.Reply, reply => reply.article),
    __metadata("design:type", Array)
], Article.prototype, "replies", void 0);
Article = __decorate([
    typeorm_1.Entity()
], Article);
exports.Article = Article;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXJ0aWNsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdHkvQXJ0aWNsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFDQUFpSjtBQUNqSix5Q0FBc0M7QUFDdEMsaUNBQThCO0FBQzlCLHVDQUFvQztBQUNwQywrQkFBNEI7QUFDNUIsbUNBQWdDO0FBR2hDLElBQWEsT0FBTyxHQUFwQixNQUFhLE9BQU87Q0F5Q25CLENBQUE7QUF0Q0M7SUFEQyxnQ0FBc0IsRUFBRTs7bUNBQ2Q7QUFHWDtJQURDLGdCQUFNLEVBQUU7O3NDQUNLO0FBR2Q7SUFEQyxnQkFBTSxFQUFFOzt5Q0FDUTtBQUdqQjtJQURDLGdCQUFNLEVBQUU7O3lDQUNRO0FBR2pCO0lBREMsZ0JBQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQzs7eUNBQ047QUFHakI7SUFEQywwQkFBZ0IsRUFBRTs7MkNBQ0E7QUFHbkI7SUFEQywwQkFBZ0IsRUFBRTs7MkNBQ0E7QUFHbkI7SUFEQyxnQkFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDOztzQ0FDVDtBQUdkO0lBREMsa0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGlCQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDOzhCQUNoRSxpQkFBTzt3Q0FBQztBQUdqQjtJQURDLG1CQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxtQkFBUSxFQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDOzhCQUM5RixtQkFBUTt5Q0FBQztBQUduQjtJQURDLG1CQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDOzhCQUN6QyxXQUFJO3FDQUFDO0FBR1g7SUFEQyxvQkFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQzs7cUNBQ2pDO0FBR1o7SUFEQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQzs7d0NBQ2hDO0FBdkNOLE9BQU87SUFEbkIsZ0JBQU0sRUFBRTtHQUNJLE9BQU8sQ0F5Q25CO0FBekNZLDBCQUFPIn0=