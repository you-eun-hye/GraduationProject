const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "jaewon",
    password: "jaewon0625",
    database: "loginlecture",
});

db.connect();

module.exports = db;