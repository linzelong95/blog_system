const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { conditionQuery: { disabled, name = "", orderBy = {}, sort = [] }, index = 1, size = 10, prettyFormat = false, allCateAndSort = false } = ctx.request.body;
    const getOrderBySql = (orderBy) => {
        const { name, by } = orderBy;
        if (!["name", "sort", "create_time", "modified_time", "disabled"].includes(name)) return "";
        return `order by ${name} ${by}`;
    };
    const orderAndlimitSql = `${getOrderBySql(orderBy)} limit ${(index - 1) * size},${size}`;
    const whereSql = `and c.name like '%${name}%' ${disabled ? `and c.disabled=${disabled}` : ""} ${sort.length > 0 ? `and c.sort in (${sort.join(",")})` : ""}`
    const sql = `
        select 
            c.id,c.name,c.sort,c.disabled,c.is_use,s.name as sort_name,s.is_use as sort_is_use,s.disabled as sort_disabled
        from 
            category as c,sort as s
        where
            c.sort=s.id ${whereSql} ${orderAndlimitSql}
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
                    obj.children=[...obj.children,{ id: i.id, name: i.name, is_use: i.is_use, disabled: i.disabled }];
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
    const countArr = await db.query(`select count(*) as count from category as c where 1=1 ${whereSql}`, []);
    ctx.body = { "total": countArr[0].count, "list": res };
});

router.post("/insert", async (ctx) => {
    const { name, disabled, sort } = ctx.request.body;
    const insertSql = "insert into category (name,disabled,sort) values(?,?,?)";
    const insertParams = [name, disabled, sort];
    const res = await db.query(insertSql, insertParams);
    const resSort=await db.query(`update sort set is_use=1 where id=${sort}`, []);
    ctx.body = { "list": res };
});

router.post("/update", async (ctx) => {
    const { name, disabled, id, sort } = ctx.request.body;
    const updateSql = "update category set name=?,disabled=?,sort=? where id=?";
    const updateParams = [name, disabled, sort, id];
    const res = await db.query(updateSql, updateParams);
    const resSort=await db.query(`update sort set is_use=1 where id=${sort}`, []);
    ctx.body = { "list": res };
});

router.post("/delete", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const deleteSql = `delete from category where id in (${condition})`;
    const res = await db.query(deleteSql, []);
    ctx.body = { "list": res };
});

router.post("/lock", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update category set disabled=1 where id in (${condition})`;
    const updateParams = [];
    const res = await db.query(updateSql, updateParams);
    ctx.body = { "list": res };
});

router.post("/unlock", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const updateSql = `update category set disabled=0 where id in (${condition})`;
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