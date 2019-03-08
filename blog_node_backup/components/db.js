const mysql = require("mysql");
const dbConfig = require("../config/sqlConfig");

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