const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const {id:currentUserId}=ctx.state.user;
    const { conditionQuery: {content="",orderBy = {},aids=[] },prettyFormat=false } = ctx.request.body;
    const getWhereSql = (aids) => {
        if (!aids.length) return "";
        return `and c.aid in (${aids.join(",")})`;
    };
    const getOrderBySql = (orderBy) => {
        const {name="create_time",by="desc"}=orderBy;
        if(!["create_time"].includes(name)) return "";
        return `order by ${name} ${by}`;
    };
    const sql = `
        select 
            c.id,c.aid,c.from_id,c.to_id,c.pid,c.content,c.is_show,c.is_top,c.create_time,a.account as from_name,b.account as to_name,e.title
        from 
            comment c
        inner join 
            user a on c.from_id=a.id
        inner join 
            user b on c.to_id=b.id
        inner join
            article e on c.aid=e.id
        where 
            c.content like '%${content}%' and e.author_id=${currentUserId} ${getWhereSql(aids)} ${getOrderBySql(orderBy)}
    `;
    let res = await db.query(sql, []);
    if(prettyFormat){
        const parentArr = [];
        const sonArr = [];
        res.forEach(i => {
            if (!i.pid) {
                parentArr.push({ ...i, children: [] });
            } else {
                sonArr.push(i);
            }
        });
        res = parentArr.map(i => {
            sonArr.forEach(v => {
                if (v.pid === i.id) i.children = [...i.children, v];
            });
            return i;
        });
    }
    const countSql = `
        select 
            count(*) as count
        from 
            comment c
        inner join 
            user a on c.from_id=a.id
        inner join 
            user b on c.to_id=b.id
        inner join
            article e on c.aid=e.id
        where 
            c.content like '%${content}%' and e.author_id=${currentUserId} ${getWhereSql(aids)}
    `;
    const countArr = await db.query(countSql, []);
    ctx.body = { "total": countArr[0].count, "list": res };
});

router.post("/insert", async (ctx) => {
    const {id:currentUserId}=ctx.state.user;
    const { aid, from_id, to_id = 0, pid = 0, content,author_id } = ctx.request.body;
    const insertSql = "insert into comment (aid,from_id,to_id,pid,content,is_show) values(?,?,?,?,?,?)";
    const insertParams = [aid, from_id, to_id, pid, content,currentUserId===author_id?1:0];
    const res = await db.query(insertSql, insertParams);
    ctx.body = { "list": res };
});


router.post("/delete", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const rootIds=[];
    items.forEach(i=>{
        if(i.pid===0) rootIds.push(i.id);
    });
    const deleteSql = `delete from comment where id in (${condition}) ${rootIds.length>0?`or pid in (${rootIds.join(",")})`:""}`;
    const res = await db.query(deleteSql, []);
    ctx.body = { "list": res };
});

router.post("/show", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const rootIds=[];
    items.forEach(i=>{
        if(i.pid===0) rootIds.push(i.id);
    });
    const updateSql = `update comment set is_show=1 where id in (${condition}) ${rootIds.length>0?`or pid in (${rootIds.join(",")})`:""}`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/unshow", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const rootIds=[];
    items.forEach(i=>{
        if(i.pid===0) rootIds.push(i.id);
    });
    const updateSql = `update comment set is_show=0 where id in (${condition}) ${rootIds.length>0?`or pid in (${rootIds.join(",")})`:""}`;
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