const mysql = require("mysql");

const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWORD,
    database: process.env.DB_DATABASE,
}

module.exports = {
    init: function(){
        return mysql.createConnection(db);
    },
    connect: function(conn){
        conn.connect(function(err){
            if(err) console.log('mysql connection error: '+err);
            else console.log('mysql is connected successfully');
        });
    }
}

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "9598",
//     database: "graduation",
// });

// db.connect();

// module.exports = db;