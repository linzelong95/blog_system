const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { conditionQuery: { disabled, name = "", orderBy = {}, sortIds = [] }, index = 1, size = 10, prettyFormat = false, allCateAndSort = false } = ctx.request.body;
    const getSql = (onlyTotalNum) => (`
        select
            ${onlyTotalNum? "count(*) as count": "l.id,l.name,l.sort_id,l.disabled,l.is_use,s.name as sort_name,s.is_use as sort_is_use,s.disabled as sort_disabled"}
        from 
            label as l,sort as s
        where
            l.sort_id=s.id
            and l.name like '%${name}%' 
            ${disabled ? `and l.disabled=${disabled}` : ""} 
            ${sortIds.length > 0 ? `and l.sort_id in (${sortIds.join(",")})` : ""}
        ${onlyTotalNum ? "":
            `
                order by
                    ${(() => {
                        const { name="create_time", by="asc" } = orderBy;
                        if (!["name", "sort_id", "create_time", "modified_time", "disabled"].includes(name)) return "";
                        return `l.${name} ${by}`;
                    })()}
                limit 
                    ${(index - 1) * size},${size}
            `
        }
    `);
    const tagList = await db.query(getSql(), []);
    const uniqueSortIds = Array.from(new Set(tagList.map(i => i.sort_id)));
    let res = tagList;
    if (prettyFormat) {
        res = uniqueSortIds.map(item => {
            const obj = { id: item, name: "", is_use: 0, disabled: 0, children: [] };
            tagList.forEach(i => {
                if (i.sort_id === item) {
                    obj.name = i.sort_name;
                    obj.is_use = i.sort_is_use;
                    obj.disabled = i.sort_disabled;
                    obj.children = [...obj.children, { id: i.id, name: i.name, is_use: i.is_use, disabled: i.disabled }];
                }
            });
            return obj;
        });
    }
    if (allCateAndSort) {
        let resSort = await db.query("select * from sort", []);
        res = resSort.map(item => {
            const obj = { ...item, children: [] };
            obj.children = tagList.filter(i => i.sort_id === item.id);
            return obj;
        });
    }
    const countArr = await db.query(getSql(true), []);
    ctx.body = { "total": countArr[0].count, "list": res };
});

router.post("/insert", async (ctx) => {
    const { name, disabled, sort_id } = ctx.request.body;
    const insertSql = "insert into label (name,disabled,sort_id) values(?,?,?)";
    const insertParams = [name, disabled, sort_id];
    const res = await db.query(insertSql, insertParams);
    const resSort = await db.query(`update sort set is_use=1 where id=${sort_id}`, []);
    ctx.body = { "list": res };
});

router.post("/update", async (ctx) => {
    const { name, disabled, id, sort_id } = ctx.request.body;
    const updateSql = "update label set name=?,disabled=?,sort_id=? where id=?";
    const updateParams = [name, disabled, sort_id, id];
    const res = await db.query(updateSql, updateParams);
    const resSort = await db.query(`update sort set is_use=1 where id=${sort_id}`, []);
    ctx.body = { "list": res };
});

router.post("/delete", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const deleteSql = `delete from label where id in (${condition})`;
    const res = await db.query(deleteSql, []);
    ctx.body = { "list": res };
});

router.post("/lock", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update label set disabled=1 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/unlock", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update label set disabled=0 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

module.exports = router.routes();