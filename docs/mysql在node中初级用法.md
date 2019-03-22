# mysql在node中的使用
## 安装

> npm install mysql --save

## 配置

```
//db.js  假设位于root/components/目录下

const mysql = require("mysql");
const dbConfig = {
	host:"127.0.0.1",//主机
	user:"root",//用户名
	password:"admin",//密码
	database:"blog_react",//数据库名称
	port:"3306"//端口号
}；

// 方法一：简单使用
// module.exports={
//     query:(sql,params)=>{
//         return new Promise((resolve,reject)=>{
//             const connection=mysql.createConnection(dbConfig);
//             connection.connect((err)=>{
//                 if(err) throw err;
//                 connection.query(sql,params,(err,results,fields)=>{
//                     if(err) reject(err);
//                     resolve(results);
//                     connection.end((err)=>{
//                         if(err) throw err;
//                     });
//                 });
//             });
//         });
//     },
// };

//方法二：数据池连接
const pool = mysql.createPool(dbConfig);
module.exports = {
	query: (sql, params) => {
		return new Promise((resolve, reject) => {
			pool.getConnection((err, con) => {
				if (err) throw err;
					con.query(sql, params, (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                    con.release();
                });
            });
        });
    },
};
```

 ## 使用

```
//user.js  假设位于root/routes/目录下

const db=require("../components/db");
const router = require("koa-router")();

router.post("/list", async (ctx) => {
    const sql = "select * from article where is_use=? and disabled=?";
    const params=[0,0];
    const res = await db.query(sql, params);
    if(res.length){
        ctx.status=200;
        ctx.body={“list”：res};
        return;
    }
    ctx.status=404;
    ctx.body = { msg:"添加失败" };
});
router.post("/insert", async (ctx) => {
	const { name, disabled } = ctx.request.body;//从前台传来的参数
    const insertSql = "insert into sort (name,disabled) values(?,?)";
    const insertParams = [name, disabled];
    const res = await db.query(insertSql, insertParams);
    if(res.affectedRows){
        ctx.status=200;
        ctx.body={"msg":"添加成功"};
        return;
    }
    ctx.status=404;
    ctx.body = { "msg":"添加失败" };
});
```

## 进阶

> 考虑使用 **typeorm数据库ORM框架** 或者 **sequelize**