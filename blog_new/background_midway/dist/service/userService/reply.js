"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const midway_1 = require("midway");
const typeorm_1 = require("typeorm");
const Reply_1 = require("../../entity/Reply");
let UserReplyService = class UserReplyService {
    constructor() {
        this.repository = typeorm_1.getRepository(Reply_1.Reply);
    }
    async list(options) {
        const { reply, orderBy, index, size, articleIdsArr, isTop, isApproved } = options;
        const orderByMap = { "reply.isTop": "DESC" };
        if (orderBy.name && ["isApproved", "isTop", "createDate", "updateDate"].includes(orderBy.name))
            orderByMap[`reply.${orderBy.name}`] = orderBy.by;
        if (!orderBy.name || !["createDate", "updateDate"].includes(orderBy.name))
            orderByMap["reply.createDate"] = "ASC";
        return await this.repository
            .createQueryBuilder("reply")
            .leftJoinAndSelect("reply.from", "fromUser")
            .leftJoinAndSelect("reply.to", "toUser")
            .where("reply.reply like :reply", { reply: `%${reply}%` })
            .andWhere(articleIdsArr.length ? `reply.article in (${articleIdsArr.join(",")})` : "1=1")
            .andWhere(isApproved !== undefined ? `reply.isApproved=${isApproved}` : "1=1")
            .andWhere(isTop !== undefined ? `reply.isTop=${isTop}` : "1=1")
            .orderBy(orderByMap)
            .skip((index - 1) * size)
            .take(size)
            .getManyAndCount();
    }
    async save(options) {
        let flag = true;
        const replyEntity = this.repository.create(Object.assign({}, options));
        await this.repository.save(replyEntity).catch(e => { flag = false; });
        return flag;
    }
    async delete(options) {
        const { idsArr, parentIdsArr } = options;
        let flag = true;
        const result = await this.repository
            .createQueryBuilder()
            .delete()
            .from(Reply_1.Reply)
            .where(`id in (${idsArr.join(",")}) ${parentIdsArr.length > 0 ? `or parentId in (${parentIdsArr.join(",")})` : ""}`)
            .execute();
        if (!result.raw.affectedRows) {
            flag = false;
        }
        return flag;
    }
};
UserReplyService = __decorate([
    midway_1.provide()
], UserReplyService);
exports.UserReplyService = UserReplyService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZS91c2VyU2VydmljZS9yZXBseS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLG1DQUFpQztBQUNqQyxxQ0FBd0M7QUFDeEMsOENBQTJDO0FBSTNDLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWdCO0lBRDdCO1FBR0UsZUFBVSxHQUFHLHVCQUFhLENBQUMsYUFBSyxDQUFDLENBQUM7SUEwQ3BDLENBQUM7SUF4Q0MsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQ2hCLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDbEYsTUFBTSxVQUFVLEdBQXFCLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQy9ELElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQUUsVUFBVSxDQUFDLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUNqSixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQUUsVUFBVSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2xILE9BQU8sTUFBTSxJQUFJLENBQUMsVUFBVTthQUN6QixrQkFBa0IsQ0FBQyxPQUFPLENBQUM7YUFDM0IsaUJBQWlCLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQzthQUMzQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDO2FBQ3ZDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7YUFDekQsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUN4RixRQUFRLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7YUFDN0UsUUFBUSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGVBQWUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUM5RCxPQUFPLENBQUMsVUFBVSxDQUFDO2FBQ25CLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNWLGVBQWUsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU87UUFDaEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxtQkFBTSxPQUFPLEVBQUcsQ0FBQztRQUMzRCxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRSxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU87UUFDbEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDekMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVU7YUFDakMsa0JBQWtCLEVBQUU7YUFDcEIsTUFBTSxFQUFFO2FBQ1IsSUFBSSxDQUFDLGFBQUssQ0FBQzthQUNYLEtBQUssQ0FBQyxVQUFVLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ25ILE9BQU8sRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFO1lBQzVCLElBQUksR0FBRyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGLENBQUE7QUE1Q1ksZ0JBQWdCO0lBRDVCLGdCQUFPLEVBQUU7R0FDRyxnQkFBZ0IsQ0E0QzVCO0FBNUNZLDRDQUFnQiJ9