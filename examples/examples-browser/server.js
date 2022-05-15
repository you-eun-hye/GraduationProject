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
    const id = body.id;
    const pwd = body.pwd;
    const repwd = body.repwd;
    const nickname = body.nickname;
    const major = body.major;

    if(!id || !pwd || !nickname){
        res.send(
            `<script>
            alert('회원가입 정보를 전부 입력하십시오.');
            location.href="/register";
            </script>`
        );
    } else if(pwd != repwd){
        res.send(
            `<script>
            alert('재확인 비밀번호가 틀렸습니다.');
            location.href="/register";
            </script>`
        );
    } else {
        db.query('insert into users (id, pwd, nickname, major) values (?, ?, ?, ?);', [ id, pwd, nickname, major ],
        function (){
            res.redirect('/')
        })
    }
});

//login
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
        if(!id || !pwd){
            res.send(
                `<script>
                  alert('로그인 정보를 입력하십시오.');
                  location.href="/";
                </script>`
            );
        }
        else if(id == data[0].id && pwd == data[0].pwd){
            req.session.name = id;
            req.session.save(function(){
                res.redirect('/todo');
            });
        } else {
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

// timer
app.get('/timer', function (req,res){
    fs.readFile('./views/timer.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});

app.post('/timer', function(req,res){
    const body = req.body;
    db.query('update todolist SET td_time=? where td_id=? and id=?;', [body.td_time, req.params.td_id, req.session.name],
    function (){
        res.redirect('/todo')
    })
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

app.get('/td_create', function (req, res){
    fs.readFile('./views/td_create.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});

app.post('/td_create', function (req, res){
    const body = req.body;
    db.query('insert into todolist (id, td_content, td_seconds, td_date) values (?, ?, 00, now());', [req.session.name, body.td_content],
    function (){
        res.redirect('/todo')
    })
});

app.get('/td_edit/:td_id', function (req, res){
    fs.readFile('./views/td_edit.ejs', 'utf8', function (err, data){
        db.query('select * from todolist where td_id=? and id=?', [req.params.td_id, req.session.name],
        function (err, result){
            res.send(ejs.render(data, { data: result[0] })) 
        })
    })
});

app.post('/td_edit/:td_id', function (req, res){
    const body = req.body;
    db.query('update todolist SET td_content=? where td_id=? and id=?', [body.td_content, req.params.td_id, req.session.name],
    function (){
        res.redirect('/todo')
    })
});

app.get('/td_delete/:td_id', function (req, res){
    db.query('delete from todolist where td_id=? and id=?', [req.params.td_id, req.session.name],
    function (){
        res.redirect('/todo')
    })
});

// community
app.get('/community', function(req, res){
    fs.readFile('./views/community.ejs', 'utf8', function (err, data){
        db.query('select community.*, users.nickname from community inner join users on community.id=users.id', function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/cm_board/:cm_id', function(req, res){
    fs.readFile('./views/cm_board.ejs', 'utf8', function (err, data){
        db.query('select * from community where cm_id=?', [req.params.cm_id],
        function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/cm_mycommunity', function(req, res){
    fs.readFile('./views/cm_mycommunity.ejs', 'utf8', function (err, data){
        db.query('select * from community where id=?', [req.session.name],
        function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/cm_myboard/:cm_id', function(req, res){
    fs.readFile('./views/cm_myboard.ejs', 'utf8', function (err, data){
        db.query('select * from community where cm_id=?', [req.params.cm_id],
        function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/cm_create', function (req, res){
    fs.readFile('./views/cm_create.ejs', 'utf8', function (err, data){
        res.send(data)
    })
});

app.post('/cm_create', function (req, res){
    const body = req.body;
    db.query('insert into community (id, cm_title, cm_content) values (?, ?, ?);', [req.session.name, body.cm_title, body.cm_content],
    function (){
        res.redirect('/community')
    })
});

app.get('/cm_edit/:cm_id', function (req, res){
    fs.readFile('./views/cm_edit.ejs', 'utf8', function (err, data){
        db.query('select * from community where cm_id=? and id=?', [req.params.cm_id, req.session.name],
        function (err, result){
            res.send(ejs.render(data, { data: result[0] }))
        })
    })
});

app.post('/cm_edit/:cm_id', function (req, res){
    const body = req.body;
    db.query('update community SET cm_content=? where cm_id=? and id=?', [body.cm_content, req.params.cm_id, req.session.name],
    function (){
        res.redirect('/community')
    })
});

app.get('/cm_delete/:cm_id', function (req, res){
    db.query('delete from community where cm_id=? and id=?', [req.params.cm_id, req.session.name],
    function (){
        res.redirect('/community')
    })
});

// follow
app.get('/follow', function(req, res){
    fs.readFile('./views/follow.ejs', 'utf8', function (err, data){
        db.query('select follow.*, users.nickname from follow inner join users on follow.fl_id=users.id where follow.id=?', [req.session.name],
        function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/fl_list', function(req, res){
    fs.readFile('./views/fl_list.ejs', 'utf8', function (err, data){
        db.query('select * from users', function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/fl_td/:fl_id', function(req, res){
    fs.readFile('./views/fl_td.ejs', 'utf8', function (err, data){
        db.query('select todolist.*, users.nickname from todolist inner join users on todolist.id=users.id where todolist.id=?', [req.params.fl_id],
        function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

app.get('/fl_insert/:id', function (req, res){
    if(req.session.name == req.params.id){
        res.send(
            `<script>
              alert('자기 자신은 팔로우 할 수 없습니다.');
              location.href="/fl_list";
            </script>`
        );
    } else {
        db.query('insert into follow (id, fl_id) values (?, ?);', [req.session.name, req.params.id],
        function (){
            res.redirect('/follow')
        })
    }
});

app.get('/fl_delete/:fl_id', function (req, res){
    db.query('delete from follow where fl_id=? and id=?', [req.params.fl_id, req.session.name],
    function (){
        res.redirect('/follow')
    })
});

app.get('/fl_recommend', function(req, res){
    fs.readFile('./views/fl_recommend.ejs', 'utf8', function (err, data){
        db.query('select * from users where major= (select major from users where id=?)', [req.session.name],
        function (err, results){
            if (err){
                res.send(err)
            } else {
                res.send(ejs.render(data, { data: results }))
            }
        })
    })
});

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, '../images')))
app.use(express.static(path.join(__dirname, '../media')))
app.use(express.static(path.join(__dirname, '../../weights')))
app.use(express.static(path.join(__dirname, '../../dist')))

app.listen(3000, () => console.log('Listening on port 3000!'))

module.exports = app;