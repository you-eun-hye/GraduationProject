const express = require('express')
const bodyParser = require("body-parser");
const path = require('path')
const { get } = require('request')

const app = express()
const ejs = require("ejs");

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require("./database/db.js");
const fs = require("fs");

app.get('/todo', function(req, res){
    fs.readFile('./views/todo.ejs', 'utf8', function (err, data){
        db.query('select * from todolist', function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/todo/delete/:id', function (req, res){
    db.query('delete from todolist where id=?', [req.params.id],
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

    db.query('insert into todolist (content) values (?);', [ body.content ],
    function (){
        res.redirect('/todo')
    })
});

app.get('/todo/edit/:id', function (req, res){
    fs.readFile('./views/edit.ejs', 'utf8', function (err, data){
        db.query('select * from todolist where id = ?', [req.params.id],
        function (err, result){
            res.send(ejs.render(data, { data: result[0] }))
        })
    })
});

app.post('/todo/edit/:id', function (req, res){
    const body = req.body;
    
    db.query('update todolist SET content=? where id=?', [ body.content, req.params.id ],
    function (){
        res.redirect('/todo')
    })
});

// 여기서부터 로그인
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
            res.redirect('/todo');
        }
        else{
            res.send(
                `<script>
                  alert('잘못된 정보입니다.');
                  location.href="/login";
                </script>`
            );
        }
    });

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