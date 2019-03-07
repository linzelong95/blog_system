const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { id: currentUserId } = ctx.state.user;
    const { conditionQuery: { content = "", orderBy = {}, aids = [], category = {},is_show,is_top,pid_field },index=1,size=10, prettyFormat = false } = ctx.request.body;
    const { sort = [], child = [] } = category;
    const getSql = (onlyTotalNum) => (`
        select
            ${onlyTotalNum? "count(*) as count": "c.id,c.aid,c.from_id,c.to_id,c.pid,c.content,c.is_show,c.is_top,c.create_time,a.account as from_name,b.account as to_name,e.title"}
        from 
            comment c
        inner join 
            user a on c.from_id=a.id
        inner join 
            user b on c.to_id=b.id
        inner join
            article e on c.aid=e.id
        inner join
            category f on e.category_id=f.id
        where 
            c.content like '%${content}%' 
            and e.author_id=${currentUserId} 
            ${aids.length > 0 ? `and c.aid in (${aids.join(",")})` : ""} 
            ${sort.length && !child.length ? `and f.sort in (${sort.join(",")})` : ""}
            ${!sort.length && child.length ? `and e.category_id in (${child.join(",")})` : ""}
            ${sort.length && child.length ? `and (f.sort in (${sort.join(",")}) or e.category_id in (${child.join(",")}))` : ""}
            ${is_show!==undefined? `and c.is_show=${is_show}` : ""} 
            ${is_top!==undefined? `and c.is_top=${is_top}` : ""} 
            ${pid_field===0?"and c.pid=0":pid_field===1?"and c.pid>1":""}
        ${onlyTotalNum ? "":
            `
                order by
                    ${(() => {
                        const {name="is_top",by="desc"}=orderBy;
                        if (!["create_time","is_top","is_show"].includes(name)) return "";
                        return `c.${name} ${by}`;
                    })()}
                limit 
                    ${(index - 1) * size},${size}
            `
        }
    `);
    let res = await db.query(getSql(), []);
    if (prettyFormat) {
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
    const countArr = await db.query(getSql(true), []);
    ctx.body = { "total": countArr[0].count, "list": res };
});

router.post("/insert", async (ctx) => {
    const { id: currentUserId } = ctx.state.user;
    const { aid, from_id=currentUserId, to_id = currentUserId, pid = 0, content, author_id=currentUserId,is_top=0 } = ctx.request.body;
    const insertSql = "insert into comment (aid,from_id,to_id,pid,content,is_top,is_show) values(?,?,?,?,?,?,?)";
    const insertParams = [aid, from_id, to_id, pid, content,is_top, currentUserId === author_id ? 1 : 0];
    const res = await db.query(insertSql, insertParams);
    ctx.body = { "list": res };
});


router.post("/delete", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const rootIds = [];
    items.forEach(i => {
        if (i.pid === 0) rootIds.push(i.id);
    });
    const deleteSql = `delete from comment where id in (${condition}) ${rootIds.length > 0 ? `or pid in (${rootIds.join(",")})` : ""}`;
    const res = await db.query(deleteSql, []);
    ctx.body = { "list": res };
});

router.post("/show", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const rootIds = [];
    items.forEach(i => {
        if (i.pid === 0) rootIds.push(i.id);
    });
    const updateSql = `update comment set is_show=1 where id in (${condition}) ${rootIds.length > 0 ? `or pid in (${rootIds.join(",")})` : ""}`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/unshow", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const rootIds = [];
    items.forEach(i => {
        if (i.pid === 0) rootIds.push(i.id);
    });
    const updateSql = `update comment set is_show=0 where id in (${condition}) ${rootIds.length > 0 ? `or pid in (${rootIds.join(",")})` : ""}`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

// 子评论置顶不会影响父评论原有的位置
router.post("/top", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const rootIds = [];
    items.forEach(i => {
        if (i.pid === 0) rootIds.push(i.id);
    });
    const updateSql = `update comment set is_top=1 where id in (${condition}) ${rootIds.length > 0 ? `or pid in (${rootIds.join(",")})` : ""}`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/untop", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const rootIds = [];
    items.forEach(i => {
        if (i.pid === 0) rootIds.push(i.id);
    });
    const updateSql = `update comment set is_top=0 where id in (${condition}) ${rootIds.length > 0 ? `or pid in (${rootIds.join(",")})` : ""}`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

module.exports = router.routes();