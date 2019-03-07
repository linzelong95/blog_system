const router = require("koa-router")();
const db = require("../../components/db");
const fs=require("fs");

router.post("/list", async (ctx) => {
    const { id: currentUserId } = ctx.state.user;
    const { conditionQuery: { title = "", category = {}, orderBy = {} }, index = 1, size = 10 } = ctx.request.body;
    const { sort = [], child = [] } = category;
    const getSql = (onlyTotalNum) => (
        `
        select
            ${onlyTotalNum? "count(*) as count": "a.id,a.image_url,a.author_id,a.disabled,a.category_id,a.title,a.is_top,a.abstract,a.label,a.create_time,a.modified_time,c.name as category_name,c.sort,s.name as sort_name"}
        from 
            article as a,category as c,sort as s
        where 
            a.category_id=c.id 
            and c.sort=s.id 
            and c.disabled=0 
            and s.disabled=0 
            and a.author_id=${currentUserId} 
            and a.title like '%${title}%'
            ${sort.length && !child.length ? `and c.sort in (${sort.join(",")})` : ""}
            ${!sort.length && child.length ? `and c.id in (${child.join(",")})` : ""}
            ${sort.length && child.length ? `and (c.sort in (${sort.join(",")}) or c.id in (${child.join(",")}))` : ""}
        ${onlyTotalNum ? "":
            `order by
                ${(() => {
                    const { name = "is_top", by = "desc" } = orderBy;
                    if (!["title", "create_time", "modified_time", "is_top"].includes(name)) return "";
                    return `a.${name} ${by}`;
                })()}
            limit 
                ${(index - 1) * size},${size}`
        }
        `
    );
    const res = await db.query(getSql(), []);
    const countArr = await db.query(getSql(true), []);
    ctx.body = { "total": countArr[0].count, "list": res };
});

router.post("/content", async (ctx) => {
    const { id } = ctx.request.body;
    const res = await db.query("select * from content where id=?", [id]);
    ctx.body = { "list": res };
});


router.post("/insert", async (ctx) => {
    const { id: author_id } = ctx.state.user;
    const { title, label = "", abstract = "", content = "", category_id, is_top,image_url } = ctx.request.body;
    const cateId = category_id[category_id.length - 1];
    const insertSql = "insert into article (category_id,title,is_top,abstract,label,author_id,image_url) values(?,?,?,?,?,?,?)";
    const insertParams = [cateId, title, is_top, abstract, label, author_id,image_url||"/img/article/defaultimg.jpeg"];
    const res = await db.query(insertSql, insertParams);
    const resCate = await db.query(`update category set is_use=1 where id=${cateId}`, []);
    const resContent = await db.query("insert into content (content) values(?)", [content]);
    ctx.body = { "list": res };
});

router.post("/update", async (ctx) => {
    const { title, label = "", abstract = "", content = "", category_id, is_top, id } = ctx.request.body;
    const cateId = category_id[category_id.length - 1];
    const updateSql = "update article set category_id=?,title=?,is_top=?,abstract=?,label=? where id=?";
    const updateParams = [cateId, title, is_top, abstract, label, id];
    const res = await db.query(updateSql, updateParams);
    const resCate = await db.query(`update category set is_use=1 where id=${cateId}`, []);
    const resContent = await db.query("update content set content=? where id=?", [content, id]);
    ctx.body = { "list": res };
});

router.post("/delete", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const deleteSql = `delete from article where id in (${condition})`;
    const res = await db.query(deleteSql, []);
    // 删除图片
    // fs.unlinkSync("/statics/img/article/",(err)=>{})
    ctx.body = { "list": res };
});

router.post("/top", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update article set is_top=1 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/untop", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update article set is_top=0 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/lock", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update article set disabled=1 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/unlock", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update article set disabled=0 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

module.exports = router.routes();