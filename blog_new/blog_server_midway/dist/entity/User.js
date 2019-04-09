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
const Reply_1 = require("./Reply");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "account", void 0);
__decorate([
    typeorm_1.Column({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ type: "enum", enum: UserRole, default: UserRole.USER }),
    __metadata("design:type", String)
], User.prototype, "roleName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "nickName", void 0);
__decorate([
    typeorm_1.OneToMany(type => Article_1.Article, article => article.user),
    __metadata("design:type", Array)
], User.prototype, "articles", void 0);
__decorate([
    typeorm_1.OneToMany(type => Reply_1.Reply, reply => reply.from),
    __metadata("design:type", Array)
], User.prototype, "froms", void 0);
__decorate([
    typeorm_1.OneToMany(type => Reply_1.Reply, reply => reply.to),
    __metadata("design:type", Array)
], User.prototype, "tos", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9lbnRpdHkvVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFDQUE0RTtBQUM1RSx1Q0FBb0M7QUFDcEMsbUNBQWdDO0FBR2hDLElBQVksUUFHWDtBQUhELFdBQVksUUFBUTtJQUNoQiwyQkFBZSxDQUFBO0lBQ2YseUJBQWEsQ0FBQTtBQUNqQixDQUFDLEVBSFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFHbkI7QUFJRCxJQUFhLElBQUksR0FBakIsTUFBYSxJQUFJO0NBMEJoQixDQUFBO0FBdkJHO0lBREMsZ0NBQXNCLEVBQUU7O2dDQUNkO0FBR1g7SUFEQyxnQkFBTSxFQUFFOztxQ0FDTztBQUdoQjtJQURDLGdCQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7O3NDQUNUO0FBR2pCO0lBREMsZ0JBQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDOztzQ0FDOUM7QUFHbkI7SUFEQyxnQkFBTSxFQUFFOztzQ0FDUTtBQUdqQjtJQURDLG1CQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzs7c0NBQ2hDO0FBR3BCO0lBREMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7O21DQUMvQjtBQUdmO0lBREMsbUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7O2lDQUMvQjtBQXhCSixJQUFJO0lBRGhCLGdCQUFNLEVBQUU7R0FDSSxJQUFJLENBMEJoQjtBQTFCWSxvQkFBSSJ9