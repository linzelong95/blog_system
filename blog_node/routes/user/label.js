const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { conditionQuery: { disabled, name = "", orderBy = {}, sortIds = [] }, index = 1, size = 10, prettyFormat = false, prettyFormatAndAll = false } = ctx.request.body;
    const getSql = (onlyTotalNum) => (`
        select
            ${onlyTotalNum? "count(*) as count": "l.*,s.name as sort_name,s.is_use as sort_is_use,s.disabled as sort_disabled"}
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
    if (prettyFormatAndAll) {
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


module.exports = router.routes();