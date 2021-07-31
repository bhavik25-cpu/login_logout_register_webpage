var mysql = require('mysql');
const util = require('util');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass",
  database: "sys",
  port:"3306"
});


// node native promisify
const db = util.promisify(conn.query).bind(conn);

module.exports = {
    "verifyUser": async function(email, password){
        let rows;
        try{
            rows = await db(`select count(*) as count from persons where email='${email}' and password='${password}'`);
            console.log("Email exists : "+rows[0].count);
        }
        catch(err){
            console.log("Error occured while verifying user"+err);
            return  {"status":"unsuccess","msg":"Error occured while verifying user"};
        }
        finally {
            conn.end();
            return  {"status":"success","msg":"","data":rows[0].count};
        }
    },
    "registerUser": async function(o){
        let result;
        try{
            result = await db(`insert into persons values ('${o.first}','${o.last}','${o.email}','${o.mobile}','${o.password}')`);
            console.log("User inserted successfully");
        }
        catch(err){
            console.log("Error occured while registering user"+err);
            return  {"status":"unsuccess","msg":"Error occured while registering user"};
        }
        finally {
            conn.end();
            return  {"status":"success","msg":"","data":""};
        }
    }
};
