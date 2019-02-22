const router = require("koa-router")();
const db = require("../../components/db");

// router.get("/",async (ctx)=>{
//     // ctx.body="轮播图首页";
//     await ctx.render("admin/focus/index");
// });


router.post("/list", async (ctx) => {
    const {userInfo:{id:currentUserId}}=ctx.session;
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
            a.author_id=${currentUserId} and a.category_id=c.id and c.sort=s.id and c.disabled=0 and s.disabled=0 and a.title like '%${title}%' ${getWhereSql(category)} ${orderAndlimitSql}
        `;
    const res = await db.query(querySql, []);
    const countArr = await db.query(`select count(*) as count from article as a,category as c where a.category_id=c.id and a.title like '%${title}%' ${getWhereSql(category)}`, []);
    ctx.body = { "total": countArr[0].count, "list": res };
});

router.post("/listone", async (ctx) => {
    const { id } = ctx.request.body;
    const querySql = `
        select 
            *
        from 
            content
        where 
            id=${id}
        `;
    const res = await db.query(querySql, []);
    ctx.body = { "list": res };
});


router.post("/insert", async (ctx) => {
    const {id:author_id}=ctx.session.userInfo;
    const { title, label = "", abstract = "", content = "",category_id, is_top } = ctx.request.body;
    const cateId=category_id[category_id.length - 1];
    const insertSql = "insert into article (category_id,title,is_top,abstract,label,author_id) values(?,?,?,?,?,?)";
    const insertParams = [cateId, title,is_top, abstract, label, author_id];
    const res = await db.query(insertSql, insertParams);
    const resCate=await db.query(`update category set is_use=1 where id=${cateId}`, []);
    const resContent=await db.query("insert into content (content) values(?)", [content]);
    ctx.body = { "list": res };
});

router.post("/update", async (ctx) => {
    const {id:author_id}=ctx.session.userInfo;
    const { title, label = "", abstract = "", content = "", category_id, is_top, id } = ctx.request.body;
    const cateId=category_id[category_id.length - 1];
    const updateSql = "update article set category_id=?,title=?,is_top=?,abstract=?,label=?,author_id=? where id=?";
    const updateParams = [cateId, title, is_top, abstract, label, author_id, id];
    const res = await db.query(updateSql, updateParams);
    const resCate=await db.query(`update category set is_use=1 where id=${cateId}`, []);
    const resContent = await db.query("update content set content=? where id=?", [content,id]);
    ctx.body = { "list": res };
});

router.post("/delete", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const deleteSql = `delete from article where id in (${condition})`;
    const res = await db.query(deleteSql, []);
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