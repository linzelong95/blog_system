const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { conditionQuery: { orderBy = {}, aids = [] }, prettyFormat = false } = ctx.request.body;
    const getSql = (onlyTotalNum) => (`
        select
            ${onlyTotalNum? "count(*) as count": "c.*,a.account as from_name,b.account as to_name"}
        from 
            comment c
        inner join 
            user a on c.from_id=a.id
        inner join 
            user b on c.to_id=b.id
        where 
            ${aids.length > 0 ? `c.aid in (${aids.join(",")})` : ""}
        ${onlyTotalNum ? "":
            `
                order by
                    ${(() => {
                        const { name = "is_top", by = "desc" } = orderBy;
                        if (!["create_time", "is_top"].includes(name)) return "";
                        return `c.${name} ${by}`;
                    })()}
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
    const { aid, from_id, to_id, pid = 0, content, author_id } = ctx.request.body;
    const insertSql = "insert into comment (aid,from_id,to_id,pid,content,is_show) values(?,?,?,?,?,?)";
    const insertParams = [aid, from_id, to_id, pid, content, currentUserId === author_id ? 1 : 0];
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


module.exports = router.routes();