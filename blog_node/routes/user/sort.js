const router=require("koa-router")();
const db=require("../../components/db");

router.post("/list", async (ctx) => {
    const { conditionQuery: { disabled, name = "", orderBy = {} }, index = 1, size = 10 } = ctx.request.body;
    const sql = `
        select sql_calc_found_rows
            * 
        from 
            sort 
        where 
            name like '%${name}%' 
            ${disabled ? `and disabled=${disabled}` : ""}
        order by
            ${(() => {
                const { name = "create_time", by = "asc" } = orderBy;
                if (!["name", "create_time", "modified_time", "disabled"].includes(name)) return "";
                return `${name} ${by}`;
            })()}
        limit 
            ${(index - 1) * size},${size}
    `;
    const res = await db.query(sql, []);
    const countArr = await db.query("select found_rows() as count", []);
    ctx.body = { "total": countArr[0].count, "list": res };
});


module.exports=router.routes();