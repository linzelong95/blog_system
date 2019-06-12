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
const Tag_1 = require("./Tag");
let Sort = class Sort {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Sort.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Sort.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Sort.prototype, "isEnable", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Sort.prototype, "isUsed", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Sort.prototype, "createDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Sort.prototype, "updateDate", void 0);
__decorate([
    typeorm_1.OneToMany(type => Category_1.Category, category => category.sort),
    __metadata("design:type", Array)
], Sort.prototype, "categories", void 0);
__decorate([
    typeorm_1.OneToMany(type => Tag_1.Tag, tag => tag.sort),
    __metadata("design:type", Array)
], Sort.prototype, "tags", void 0);
Sort = __decorate([
    typeorm_1.Entity()
], Sort);
exports.Sort = Sort;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU29ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdHkvU29ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFDQUFnSDtBQUNoSCx5Q0FBc0M7QUFDdEMsK0JBQTRCO0FBRzVCLElBQWEsSUFBSSxHQUFqQixNQUFhLElBQUk7Q0EwQmhCLENBQUE7QUF2Qkc7SUFEQyxnQ0FBc0IsRUFBRTs7Z0NBQ2Q7QUFHWDtJQURDLGdCQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7O2tDQUNaO0FBR2I7SUFEQyxnQkFBTSxDQUFDLEVBQUMsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDOztzQ0FDSDtBQUdqQjtJQURDLGdCQUFNLENBQUMsRUFBQyxPQUFPLEVBQUMsQ0FBQyxFQUFDLENBQUM7O29DQUNMO0FBR2Y7SUFEQywwQkFBZ0IsRUFBRTs7d0NBQ0E7QUFHbkI7SUFEQywwQkFBZ0IsRUFBRTs7d0NBQ0E7QUFHbkI7SUFEQyxtQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsbUJBQVEsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7O3dDQUNoQztBQUd2QjtJQURDLG1CQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDOztrQ0FDNUI7QUF4QkgsSUFBSTtJQURoQixnQkFBTSxFQUFFO0dBQ0ksSUFBSSxDQTBCaEI7QUExQlksb0JBQUkifQ==