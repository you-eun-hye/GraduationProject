const mysql = require("mysql");

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "jaewon",
    password: "jaewon0625",
    database: "loginlecture"
});

db.connect();

module.exports = db;