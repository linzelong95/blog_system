const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { aid,checkpass } = ctx.request.body;
    const sql = `
        select 
            c.id,c.aid,c.from_id,c.to_id,c.pid,c.content,c.checkpass,c.create_time,a.account as from_name,b.account as to_name
        from 
            comment c
        inner join 
            user a on c.from_id=a.id
        inner join 
            user b on c.to_id=b.id
        where 
            c.aid=${aid}`;
    const res = await db.query(sql, []);
    const parentArr = [];
    const sonArr = [];
    res.forEach(i => {
        if (!i.pid) {
            parentArr.push({ ...i, children: [] });
        } else {
            sonArr.push(i);
        }
    });
    const commentList = parentArr.map(i => {
        sonArr.forEach(v => {
            if (v.pid === i.id) i.children = [...i.children, v];
        })
        return i;
    })
    const countArr = await db.query(`select count(*) as count from comment where aid=${aid}`, []);
    ctx.body = { "total": countArr[0].count, "list": commentList };
});

router.post("/insert", async (ctx) => {
    const { aid, from_id, to_id = 0, pid = 0, content } = ctx.request.body;
    const insertSql = "insert into comment (aid,from_id,to_id,pid,content) values(?,?,?,?,?)";
    const insertParams = [aid, from_id, to_id, pid, content];
    const res = await db.query(insertSql, insertParams);
    ctx.body = { "list": res };
});


router.post("/delete", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const deleteSql = `delete from sort where id in (${condition})`;
    const res = await db.query(deleteSql, []);
    ctx.body = { "list": res };
});

router.post("/lock", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update sort set disabled=1 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/unlock", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update sort set disabled=0 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});


// router.get("/edit",async (ctx)=>{
//     // ctx.body="编辑轮播图";
//     await ctx.render("admin/focus/edit");
// });

// router.get("/delete",async (ctx)=>{
//     ctx.body="删除轮播图";
// });

module.exports = router.routes();