const mysql = require("mysql");

const db = mysql.createConnection({
    host: "jaewon-database.c2uoenvwvmn8.ap-northeast-2.rds.amazonaws.com",
    user: "jaewon",
    password: "jaewon0625",
    database: "login_lecture",
});

db.connect();

module.exports = db;