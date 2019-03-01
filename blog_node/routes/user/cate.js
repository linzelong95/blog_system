const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { conditionQuery: { disabled, name = "", orderBy = {}, sort = [] }, index = 1, size = 10, prettyFormat = false, allCateAndSort = false } = ctx.request.body;
    const sql = `
        select sql_calc_found_rows
            c.id,c.name,c.sort,c.disabled,c.is_use,s.name as sort_name,s.is_use as sort_is_use,s.disabled as sort_disabled
        from 
            category as c,sort as s
        where
            c.sort=s.id
            and c.name like '%${name}%' 
            ${disabled ? `and c.disabled=${disabled}` : ""} 
            ${sort.length > 0 ? `and c.sort in (${sort.join(",")})` : ""}
        order by
            ${(() => {
                const { name="create_time", by="asc" } = orderBy;
                if (!["name", "sort", "create_time", "modified_time", "disabled"].includes(name)) return "";
                return `c.${name} ${by}`;
            })()}
        limit 
            ${(index - 1) * size},${size}
    `;
    const categoryList = await db.query(sql, []);
    const sortIds = Array.from(new Set(categoryList.map(i => i.sort)));
    let res = categoryList;
    if (prettyFormat) {
        res = sortIds.map(item => {
            const obj = { id: item, name: "", is_use: 0, disabled: 0, children: [] };
            categoryList.forEach(i => {
                if (i.sort === item) {
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
            obj.children = categoryList.filter(i => i.sort === item.id);
            return obj;
        });
    }
    const countArr = await db.query("select found_rows() as count", []);
    ctx.body = { "total": countArr[0].count, "list": res };
});


module.exports = router.routes();