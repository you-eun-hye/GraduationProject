const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const ejs = require("ejs");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require('path')
const { get } = require('request')

app.set("views", "./views");
app.set("view engine", "ejs");

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));// URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(session({
    secret: 'jaewon',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

const db = require("./database/db.js");
const fs = require("fs");

// register
app.get('/register', function (req, res){
    fs.readFile('./views/register.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});
app.post('/register', function (req, res){
    const body = req.body;

    db.query('insert into users (id, pwd) values (?, ?);', [ body.id, body.pwd ],
    function (){
        res.redirect('/')
    })
});

// login
app.get('/', function (req,res){
    fs.readFile('./views/login.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});

app.post('/', function (req,res){
    const body = req.body;
    const id = body.id;
    const pwd = body.pwd;

    db.query('select * from users where id=?',[id],(err,data)=>{
        if(id == data[0].id && pwd == data[0].pwd){
            req.session.name = id;
            req.session.save(function(){
                res.redirect('/todo');
            });
        }else{
            res.send(
                `<script>
                  alert('잘못된 정보입니다.');
                  location.href="/";
                </script>`
            );
        }
    });
});

app.get('/logout', (req,res) => {
    req.session.destroy(function(err){
        res.redirect('/');
    });
});

// todolist
app.get('/todo', function(req, res){
    fs.readFile('./views/todo.ejs', 'utf8', function (err, data){
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
        res.redirect('/todo')
    })
});

app.get('/todo/insert', function (req, res){
    fs.readFile('./views/create.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});

app.post('/todo/insert', function (req, res){
    const body = req.body;
    db.query('insert into todolist (id, content) values (?, ?);', [req.session.name, body.content],
    function (){
        res.redirect('/todo')
    })
});

app.get('/edit/:numb', function (req, res){
    fs.readFile('./views/edit.ejs', 'utf8', function (err, data){
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
        res.redirect('/todo')
    })
});

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, '../images')))
app.use(express.static(path.join(__dirname, '../media')))
app.use(express.static(path.join(__dirname, '../../weights')))
app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/timer', (req, res) => res.redirect('/webcamFaceDetection.html'))
app.get('/timer', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceDetection.html')))

app.listen(3000, () => console.log('Listening on port 3000!'))

module.exports = app;