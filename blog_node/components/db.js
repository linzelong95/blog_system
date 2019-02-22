const mysql=require("mysql");
const dbConfig=require("../config/sqlConfig");

module.exports={
    query:function(sql,params){
        return new Promise((resolve,reject)=>{
            const connection=mysql.createConnection(dbConfig);
            connection.connect((err)=>{
                if(err) throw err;
                connection.query(sql,params,(err,results,fields)=>{
                    // if(err) throw err;
                    if(err) reject(err);
                    resolve(results);
                    connection.end((err)=>{
                        if(err) throw err;
                    })
                })
            })
        });
    },
}