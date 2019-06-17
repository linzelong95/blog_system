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
let Tag = class Tag {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Tag.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Tag.prototype, "isEnable", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Tag.prototype, "isUsed", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Tag.prototype, "createDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Tag.prototype, "updateDate", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Sort_1.Sort, sort => sort.tags, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", Sort_1.Sort)
], Tag.prototype, "sort", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Article_1.Article, article => article.tags),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Tag.prototype, "articles", void 0);
Tag = __decorate([
    typeorm_1.Entity()
], Tag);
exports.Tag = Tag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudGl0eS9UYWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBdUk7QUFDdkksaUNBQThCO0FBQzlCLHVDQUFtQztBQUduQyxJQUFhLEdBQUcsR0FBaEIsTUFBYSxHQUFHO0NBMkJmLENBQUE7QUF4Qkc7SUFEQyxnQ0FBc0IsRUFBRTs7K0JBQ2Q7QUFHWDtJQURDLGdCQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7O2lDQUNaO0FBR2I7SUFEQyxnQkFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDOztxQ0FDTjtBQUdqQjtJQURDLGdCQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUM7O21DQUNSO0FBR2Y7SUFEQywwQkFBZ0IsRUFBRTs7dUNBQ0E7QUFHbkI7SUFEQywwQkFBZ0IsRUFBRTs7dUNBQ0E7QUFHbkI7SUFEQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsV0FBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDOzhCQUNuRixXQUFJO2lDQUFDO0FBSVg7SUFGQyxvQkFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsaUJBQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDcEQsbUJBQVMsRUFBRTs7cUNBQ1E7QUF6QlgsR0FBRztJQURmLGdCQUFNLEVBQUU7R0FDSSxHQUFHLENBMkJmO0FBM0JZLGtCQUFHIn0=