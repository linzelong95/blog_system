const router=require("koa-router")();
const db=require("../../components/db");

router.post("/list",async (ctx)=>{
    const {conditionQuery: { disabled,name="",orderBy = {} },index=1,size=10}=ctx.request.body;
    const whereSql=`where name like '%${name}%' ${disabled?`and disabled=${disabled}`:""}`
    const getOrderBySql = (orderBy) => {
        const {name,by}=orderBy;
        if(!["name","create_time","modified_time","disabled"].includes(name)) return "";
        return `order by ${name} ${by}`;
    };
    const orderAndlimitSql = `${getOrderBySql(orderBy)} limit ${(index - 1) * size},${size}`;
    const sql=`select * from sort ${whereSql} ${orderAndlimitSql}`;
    const res=await db.query(sql,[]);
    const countArr=await db.query(`select count(*) as count from sort ${whereSql}`,[]);
    ctx.body={"total":countArr[0].count,"list":res};
});

router.post("/insert", async (ctx) => {
    const { name,disabled } = ctx.request.body;
    const insertSql = "insert into sort (name,disabled) values(?,?)";
    const insertParams = [name,disabled];
    const res = await db.query(insertSql, insertParams);
    ctx.body = { "list": res };
});

router.post("/update", async (ctx) => {
    const { name,disabled, id } = ctx.request.body;
    const updateSql = "update sort set name=?,disabled=? where id=?";
    const updateParams = [name,disabled, id];
    const res = await db.query(updateSql, updateParams);
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

module.exports=router.routes();