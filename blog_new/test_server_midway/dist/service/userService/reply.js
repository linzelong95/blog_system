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
        if (orderBy.name && ["isApproved", "createDate", "updateDate"].includes(orderBy.name))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZS91c2VyU2VydmljZS9yZXBseS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLG1DQUFpQztBQUNqQyxxQ0FBd0M7QUFDeEMsOENBQTJDO0FBSTNDLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWdCO0lBRDdCO1FBR0UsZUFBVSxHQUFHLHVCQUFhLENBQUMsYUFBSyxDQUFDLENBQUM7SUEwQ3BDLENBQUM7SUF4Q0MsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQ2hCLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDbEYsTUFBTSxVQUFVLEdBQXFCLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQy9ELElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxVQUFVLENBQUMsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ3hJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFBRSxVQUFVLENBQUMsa0JBQWtCLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDbEgsT0FBTyxNQUFNLElBQUksQ0FBQyxVQUFVO2FBQ3pCLGtCQUFrQixDQUFDLE9BQU8sQ0FBQzthQUMzQixpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDO2FBQzNDLGlCQUFpQixDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUM7YUFDdkMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQzthQUN6RCxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMscUJBQXFCLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQ3hGLFFBQVEsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUM3RSxRQUFRLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2FBQzlELE9BQU8sQ0FBQyxVQUFVLENBQUM7YUFDbkIsSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzthQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ1YsZUFBZSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTztRQUNoQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLG1CQUFNLE9BQU8sRUFBRyxDQUFDO1FBQzNELE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTztRQUNsQixNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUN6QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVTthQUNqQyxrQkFBa0IsRUFBRTthQUNwQixNQUFNLEVBQUU7YUFDUixJQUFJLENBQUMsYUFBSyxDQUFDO2FBQ1gsS0FBSyxDQUFDLFVBQVUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7YUFDbkgsT0FBTyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUU7WUFDNUIsSUFBSSxHQUFHLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0YsQ0FBQTtBQTVDWSxnQkFBZ0I7SUFENUIsZ0JBQU8sRUFBRTtHQUNHLGdCQUFnQixDQTRDNUI7QUE1Q1ksNENBQWdCIn0=