const router = require("koa-router")();
const db = require("../../components/db");
const fs=require("fs");

router.post("/list", async (ctx) => {
    const { id: currentUserId } = ctx.state.user;
    const { conditionQuery: { title = "", category = {}, orderBy = {} }, index = 1, size = 10 } = ctx.request.body;
    const { sort = [], child = [] } = category;
    const getSql = (onlyTotalNum) => (`
        select
            ${onlyTotalNum? "count(distinct(a.id)) as count": "group_concat(l.name) as grouplabelname,group_concat(l.id) as grouplabelid,a.*,c.name as category_name,c.sort,s.name as sort_name"}
        from 
            article as a
        left join category as c 
            on a.category_id=c.id 
        left join sort as s 
            on c.sort=s.id 
        left join article_label as al
            on a.id=al.article_id
        left join label as l
            on al.label_id=l.id
        where 
            1=1
            and c.disabled=0 
            and s.disabled=0 
            and a.author_id=${currentUserId} 
            and a.title like '%${title}%'
            ${sort.length && !child.length ? `and c.sort in (${sort.join(",")})` : ""}
            ${!sort.length && child.length ? `and c.id in (${child.join(",")})` : ""}
            ${sort.length && child.length ? `and (c.sort in (${sort.join(",")}) or c.id in (${child.join(",")}))` : ""}
        ${onlyTotalNum ? "":
            `
                group by 
                        a.id
                order by
                    ${(() => {
                        const { name = "is_top", by = "desc" } = orderBy;
                        if (!["title", "create_time", "modified_time", "is_top"].includes(name)) return "";
                        return `a.${name} ${by}`;
                    })()}
                limit 
                    ${(index - 1) * size},${size}
            `
        }
    `);
    const res = await db.query(getSql(), []);
    const countArr = await db.query(getSql(true), []);
    const formatList=res.map(item=>{
        let formatLabel=[];
        if(item.grouplabelid){
            const labelIdArr=item.grouplabelid.split(",");
            const labelNameArr=item.grouplabelname.split(",");
            formatLabel=labelIdArr.map((i,index)=>({id:parseInt(i,10),name:labelNameArr[index]}));
        }
        item.label=formatLabel;
        return item;
    });
    ctx.body = { "total": countArr[0].count, "list": formatList };
});

router.post("/content", async (ctx) => {
    const { id } = ctx.request.body;
    const res = await db.query("select * from content where id=?", [id]);
    ctx.body = { "list": res };
});


router.post("/insert", async (ctx) => {
    const { id: author_id } = ctx.state.user;
    const { title, label , abstract = "", content = "", category_id, is_top,image_url} = ctx.request.body;
    const cateId = category_id[category_id.length - 1];
    const insertSql = "insert into article (category_id,title,is_top,abstract,author_id,image_url) values(?,?,?,?,?,?)";
    const insertParams = [cateId, title, is_top, abstract, author_id,image_url||"/img/article/defaultimg.jpeg"];
    const res = await db.query(insertSql, insertParams);
    const resCate = await db.query(`update category set is_use=1 where id=${cateId}`, []);
    const resContent = await db.query("insert into content (content) values(?)", [content]);
    //文章和标签中间表的数据插入
    label.forEach(async i => {
        const resLabel=await db.query("insert into article_label (article_id,label_id) values(?,?)", [res.insertId,i.id]);
    });
    ctx.body = { "list": res };
});

router.post("/update", async (ctx) => {
    const { title, label, abstract = "", content = "", category_id, is_top, id } = ctx.request.body;
    const cateId = category_id[category_id.length - 1];
    const updateSql = "update article set category_id=?,title=?,is_top=?,abstract=? where id=?";
    const updateParams = [cateId, title, is_top, abstract, id];
    const res = await db.query(updateSql, updateParams);
    const resCate = await db.query(`update category set is_use=1 where id=${cateId}`, []);
    const resContent = await db.query("update content set content=? where id=?", [content, id]);
    // 暂时只能粗暴地先删后增
    const deleteArticleLabel = await db.query(`delete from article_label where article_id=?`, [id]);
    label.forEach(async i=>{
        const insertArticleLabel=await db.query("insert into article_label (article_id,label_id) values(?,?)", [id,i.id]);
    })
    ctx.body = { "list": res };
});

router.post("/delete", async (ctx) => {
    const { items } = ctx.request.body;
    const condition = items.map(i => i.id).join(",");
    const deleteSql = `delete from article where id in (${condition})`;
    const res = await db.query(deleteSql, []);
    // 删除图片
    // fs.unlinkSync("/statics/img/article/",(err)=>{})
    const resArticleLabel=await db.query(`delete from article_label where article_id in (${condition})`, []);
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