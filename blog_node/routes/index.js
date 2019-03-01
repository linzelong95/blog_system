const router = require("koa-router")();
const db = require("../components/db");


router.post("/list", async (ctx) => {
    const { conditionQuery: { title = "", category = {}, orderBy = {} }, index = 1, size = 10 } = ctx.request.body;
    const getWhereSql = (category) => {
        const { sort = [], child = [] } = category;
        if (!sort.length && !child.length) return "";
        if (sort.length && !child.length) return `and c.sort in (${sort.join(",")})`;
        if (!sort.length && child.length) return `and c.id in (${child.join(",")})`;
        if (sort.length && child.length) return `and (c.sort in (${sort.join(",")}) or c.id in (${child.join(",")}))`;
    };
    const getOrderBySql = (orderBy) => {
        const {name="is_top",by="desc"}=orderBy;
        if(!["title","create_time","modified_time","is_top"].includes(name)) return "";
        return `order by ${name} ${by}`;
    };
    const orderAndlimitSql = `${getOrderBySql(orderBy)} limit ${(index - 1) * size},${size}`;
    const querySql = `
        select 
            a.id,a.author_id,a.disabled,a.category_id,a.title,a.is_top,a.abstract,a.label,a.create_time,a.modified_time,c.name as category_name,c.sort,s.name as sort_name
        from 
            article as a,category as c,sort as s
        where 
            a.category_id=c.id and c.sort=s.id and c.disabled=0 and s.disabled=0 and a.disabled=0 and a.title like '%${title}%' ${getWhereSql(category)} ${orderAndlimitSql}
        `;
    const res = await db.query(querySql, []);
    const countArr = await db.query(`select count(*) as count from article as a,category as c where a.category_id=c.id and a.disabled=0 and a.title like '%${title}%' ${getWhereSql(category)}`, []);
    ctx.body = { "total": countArr[0].count, "list": res };
});

router.post("/content", async (ctx) => {
    const { id } = ctx.request.body;
    const res = await db.query("select * from content where id=?", [id]);
    ctx.body = { "list": res };
});


module.exports = router.routes();