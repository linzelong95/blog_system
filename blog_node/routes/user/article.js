const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { id, conditionQuery: { title = "", category = {}, orderBy = {} }, index = 1, size = 10 } = ctx.request.body;
    const { sort = [], child = [] } = category;
    const querySql = `
        select sql_calc_found_rows
            a.id,a.image_url,a.author_id,a.disabled,a.category_id,a.title,a.is_top,a.abstract,a.label,a.create_time,a.modified_time,c.name as category_name,c.sort,s.name as sort_name
        from 
            article as a,category as c,sort as s
        where 
            a.category_id=c.id 
            and c.sort=s.id 
            and c.disabled=0 
            and s.disabled=0 
            ${id ? `and a.id=${id}` : ""}
            and a.title like '%${title}%'
            ${sort.length && !child.length ? `and c.sort in (${sort.join(",")})` : ""}
            ${!sort.length && child.length ? `and c.id in (${child.join(",")})` : ""}
            ${sort.length && child.length ? `and (c.sort in (${sort.join(",")}) or c.id in (${child.join(",")}))` : ""}
        order by
            ${(() => {
                const { name = "is_top", by = "desc" } = orderBy;
                if (!["title", "create_time", "modified_time", "is_top"].includes(name)) return "";
                return `a.${name} ${by}`;
            })()}
        limit 
            ${(index - 1) * size},${size}
    `;
    const res = await db.query(querySql, []);
    const countArr = await db.query("select found_rows() as count", []);
    ctx.body = { "total": countArr[0].count, "list": res };
});

router.post("/content", async (ctx) => {
    const { id } = ctx.request.body;
    const res = await db.query("select * from content where id=?", [id]);
    ctx.body = { "list": res };
});

module.exports = router.routes();