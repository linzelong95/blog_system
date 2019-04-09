const router=require("koa-router")();
const db=require("../../components/db");

router.post("/list", async (ctx) => {
    const { conditionQuery: { disabled, name = "", orderBy = {} }, index = 1, size = 10 } = ctx.request.body;
    const getSql = (onlyTotalNum) => (`
        select
            ${onlyTotalNum? "count(*) as count": "*"}
        from 
            sort 
        where 
            name like '%${name}%' 
            ${disabled ? `and disabled=${disabled}` : ""}
        ${onlyTotalNum ? "":
            `
                order by
                    ${(() => {
                        const { name = "create_time", by = "asc" } = orderBy;
                        if (!["name", "create_time", "modified_time", "disabled"].includes(name)) return "";
                        return `${name} ${by}`;
                    })()}
                limit 
                    ${(index - 1) * size},${size}
            `
        }
    `);
    const res = await db.query(getSql(), []);
    const countArr = await db.query(getSql(true), []);
    ctx.body = { "total": countArr[0].count, "list": res };
});


module.exports=router.routes();