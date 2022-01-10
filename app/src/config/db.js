const mysql = require("mysql");

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "9598",
//     database: "graduation",
// });

// db.connect();

const db = {
    host: "localhost",
    user: "root",
    password: "9598",
    database: "graduation",
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

// module.exports = db;