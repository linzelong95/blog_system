const router = require("koa-router")();
const db = require("../../components/db");

router.post("/list", async (ctx) => {
    const { id, conditionQuery: { title = "", category = {}, orderBy = {},labelIds=[] }, index = 1, size = 10 } = ctx.request.body;
    console.log(ctx.request.body)
    const { sort = [], child = [] } = category;
    /**
     * 
     * $sql = "SELECT us.* ,GROUP_CONCAT(gs.groupname) AS groupname
            FROM users us
            LEFT JOIN users_groups ug
            ON us.id = ug.user_id
            LEFT JOIN groups gs
            ON ug.group_id = gs.id
            GROUP BY ug.user_id
        ";
     */
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
            ${id ? `and a.id=${id}` : ""}
            and a.title like '%${title}%'
            ${labelIds.length ? `and al.label_id in (${labelIds.join(",")})` : ""}
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
    // ${labelIds.length ? `and al.label_id in (${labelIds.join(",")})` : ""}
    console.log(getSql())
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

module.exports = router.routes();