const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));// URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(session({
    secret: 'jaewon',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.listen(3000, () => {
    console.log("서버 가동");
});

const db = require("./src/database/db");
const fs = require("fs");

// login
app.get('/register', function (req, res){
    fs.readFile('./src/views/register.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});

app.post('/register', function (req, res){
    const body = req.body;

    db.query('insert into users (id, pwd) values (?, ?);', [ body.id, body.pwd ],
    function (){
        res.redirect('/login')
    })
});

app.get('/login', function (req,res){
    fs.readFile('./src/views/login.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});

app.post('/login', function (req,res){
    const body = req.body;
    const id = body.id;
    const pwd = body.pwd;

    db.query('select * from users where id=?',[id],(err,data)=>{
        if(id == data[0].id && pwd == data[0].pwd){
            req.session.name = id;
            req.session.save(function(){
                res.redirect('/');
            });
        }else{
            res.send(
                `<script>
                  alert('잘못된 정보입니다.');
                  location.href="/login";
                </script>`
            );
        }
    });
});

app.get('/logout', (req,res) => {
    req.session.destroy(function(err){
        res.redirect('/login');
    });
});

// todolist
app.get('/', function(req, res){
    fs.readFile('./src/views/home.ejs', 'utf8', function (err, data){
        db.query('select * from todolist where id=?', [req.session.name],
        function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/delete/:numb', function (req, res){
    db.query('delete from todolist where numb=? and id=?', [req.params.numb, req.session.name],
    function (){
        res.redirect('/')
    })
});

app.get('/insert', function (req, res){
    fs.readFile('./src/views/create.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});

app.post('/insert', function (req, res){
    const body = req.body;
    db.query('insert into todolist (id, content) values (?, ?);', [req.session.name, body.content],
    function (){
        res.redirect('/')
    })
});

app.get('/edit/:numb', function (req, res){
    fs.readFile('./src/views/edit.ejs', 'utf8', function (err, data){
        db.query('select * from todolist where numb=? and id=?', [req.params.numb, req.session.name],
        function (err, result){
            res.send(ejs.render(data, { data: result[0] }))
        })
    })
});

app.post('/edit/:numb', function (req, res){
    const body = req.body;
    db.query('update todolist SET content=? where numb=? and id=?', [body.content, req.params.numb, req.session.name],
    function (){
        res.redirect('/')
    })
});

module.exports = app;