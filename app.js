const express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
var ejs = require("ejs");

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
//EJS Engine
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);


//create connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'eaQuiz',
    insecureAuth : true

})

//connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Mysql Connect');
})

app.listen(8000, () => {
    console.log('Server started on port 8000')
})

let display = false;


app.get("/",(req,res) =>{
    //res.sendFile(path.join(__dirname,'/views/showQuestions.html'))
    res.render('showQuestions',{display})
})

app.get("/createquiz",(req,res) =>{
    res.sendFile(path.join(__dirname,'/views/createQuiz.html'))
})


//Insert hostInfo
app.post('/hostInfo', (req,res) => {
    
    let title = req.body.title;
    let HostID = Math.floor(Math.random() * 90000) + 10000;

    let data = {HostID:HostID, Title:title};
    let sql = 'insert into HostInfo SET ?';
    let query = db.query(sql, data, (err, result) => {
        if(!err){
            res.cookie('HostID', HostID)
            res.cookie('Title', title)
            res.redirect('/')
            //res.render('showQuestions',{Title: title, HostID:HostID})
        }
    })
    // console.log(query);
})

//insert question

app.post('/addQuestion', (req,res) => {
    display = true;

    let Question = req.body.qn;
    let Option1 = req.body.Option1;
    let Option2 = req.body.Option2;
    let Option3 = req.body.Option3;
    let Option4 = req.body.Option4;
    let CorrectAnswer = req.body.CorrectAnswer;
    let HostID = req.cookies.HostID;

  // console.log(Question)

    let data = {Question:Question, Option1:Option1, Option2:Option2, Option3:Option3, Option4:Option4, CorrectAnswer:CorrectAnswer, HostID:'12345'};
    let sql = 'insert into questionBank SET ?';
    let query = db.query(sql, data, (err, result) => {
        if(!err){
           res.redirect('/showQuestions')
        }
    })
})


app.get('/showQuestions', (req, res) => {
    let sql = 'SELECT * FROM questionBank';
    let query = db.query(sql, (err, result) => {
        if(!err){
           res.render('showQuestions', {questions: result, display});
        }
    });
});


app.get('/joinhost', (req, res) => {
    let code = req.cookies.HostID;
    console.log(code);
    res.render('join',{code})
});




