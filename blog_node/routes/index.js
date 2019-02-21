const router=require("koa-router")();
const db=require("../components/db");
const mysql=require("mysql");

router.post("/index",async (ctx)=>{
    const {articleTitleSearch,index=1,size=10}=ctx.request.body;
    const limitCondition=`limit ${(index-1)*size},${size}`;
    const sql=articleTitleSearch?`select * from article where title like '%${articleTitleSearch}%' ${limitCondition}`:`select * from article ${limitCondition}`;
    const res=await db.query(sql,[]);
    ctx.body={"list":res};
});

router.get("/add",async (ctx)=>{
    const insertSql="insert into article (category_id,title,content,is_top,abstract,label,ins_user) values(?,?,?,?,?,?,?)";
    const insertParams=[1,"r","## test",1,"r","r","r"];
    const res=await db.query(insertSql,insertParams);
    ctx.body={"list":res};
});

// router.get("/index",async (ctx)=>{
//     const query=()=>new Promise((resolve,reject)=>{
//         const connection=mysql.createConnection({
//             host:"120.78.139.146",
//             user:"root",
//             password:"admin",
//             database:"blog_react",
//             port:"3306"
//         });
//         connection.connect();
//         connection.query("select * from article",(err,results)=>{
//             if(err) throw err;
//             resolve({"list":results});
//             connection.end();
//         });
//     })
//     const res=await query();
//     ctx.body=res;
//     // await ctx.render('default/index');
// });

router.get("/case",async (ctx)=>{
    const connection=mysql.createConnection({
        host:"120.78.139.146",
        user:"root",
        password:"admin",
        database:"fortest",
        port:"3306"
    });
    connection.connect();
    const addSql="insert into user values(?,?)";
    const addSqlParams=["zelong",50];
    connection.query(addSql,addSqlParams,(err,results)=>{
        if(err) throw err;
        console.log(results);
    });
    connection.end();
    ctx.body="案例";
});

router.get("/about",async (ctx)=>{
    const connection=mysql.createConnection({
        host:"120.78.139.146",
        user:"root",
        password:"admin",
        database:"fortest",
        port:"3306"
    });
    connection.connect();
    const modSql="update user set age=? where name=?";
    const modSqlParams=[60,"zelong"];
    connection.query(modSql,modSqlParams,(err,results)=>{
        if(err) throw err;
        console.log(results);
    });
    connection.end();
    ctx.body="关于";
});

router.get("/delete",async (ctx)=>{
    const connection=mysql.createConnection({
        host:"120.78.139.146",
        user:"root",
        password:"admin",
        database:"fortest",
        port:"3306"
    });
    connection.connect();
    const delSql="delete from user where name='zelong'";
    connection.query(delSql,(err,results)=>{
        if(err) throw err;
        console.log(results);
    });
    connection.end();
    ctx.body="关于";
});

module.exports=router.routes();