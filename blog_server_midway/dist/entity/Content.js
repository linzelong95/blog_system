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
const Article_1 = require("./Article");
let Content = class Content {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Content.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Content.prototype, "content", void 0);
__decorate([
    typeorm_1.OneToOne(type => Article_1.Article, article => article.content, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Article_1.Article)
], Content.prototype, "article", void 0);
Content = __decorate([
    typeorm_1.Entity()
], Content);
exports.Content = Content;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdHkvQ29udGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFDQUF1RjtBQUN2Rix1Q0FBbUM7QUFHbkMsSUFBYSxPQUFPLEdBQXBCLE1BQWEsT0FBTztDQVluQixDQUFBO0FBVEc7SUFEQyxnQ0FBc0IsRUFBRTs7bUNBQ2Q7QUFHWDtJQURDLGdCQUFNLENBQUMsTUFBTSxDQUFDOzt3Q0FDQztBQUloQjtJQUZDLGtCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDO0lBQ25HLG9CQUFVLEVBQUU7OEJBQ0osaUJBQU87d0NBQUM7QUFWUixPQUFPO0lBRG5CLGdCQUFNLEVBQUU7R0FDSSxPQUFPLENBWW5CO0FBWlksMEJBQU8ifQ==