// const app = require("../../app");
// const db = require("../database/db");
// const fs = require("fs");

// app.get('/', function(req, res){
//     fs.readFile('../views/home.ejs', 'utf8', function (err, data){
//         db.query('select * from todolist', function (err, results){
//             if (err){
//                 res.send(err)
//             } else {
//                 res.send(ejs.render(data, { data: results }))
//             }
//         })
//     })
// });

// app.get('/delete/:id', function (req, res){
//     db.query('delete from todolist where id=?', [req.params.id],
//     function (){
//         res.redirect('/')
//     })
// });

// app.get('/insert', function (req, res){
//     fs.readFile('../views/create.html', 'utf8', function (err, data){
//         res.send(data)
//     })
// });

// app.post('/insert', function (req, res){
//     const body = req.body;

//     db.query('insert into todolist (content) values (?);', [ body.content ],
//     function (){
//         res.redirect('/')
//     })
// });

// app.get('/edit/:id', function (req, res){
//     fs.readFile('../views/edit.ejs', 'utf8', function (err, data){
//         db.query('select * from todolist where id = ?', [req.params.id],
//         function (err, result){
//             res.send(ejs.render(data, { data: result[0] }))
//         })
//     })
// });

// app.post('/edit/:id', function (req, res){
//     const body = req.body;
    
//     db.query('update todolist SET content=? where id=?', [ body.content, req.params.id ],
//     function (){
//         res.redirect('/')
//     })
// });