const express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

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



app.get("/",(req,res) =>{
    res.sendFile(path.join(__dirname,'/pages/addQuestion.html'))
})

//Insert hostInfo
app.get('/hostInfo', (req,res) => {
    
    //let title = req.body.title;
   // let HostID = res.body.HostID;


    let data = {HostID:'12345', Title:'Title1'};
    let sql = 'insert into HostInfo SET ?';
    let query = db.query(sql, data, (err, result) => {
        if(!err){
            res.send(result)
        }
    })
    // console.log(query);
})

//insert question

app.post('/addQuestion', (req,res) => {
    let Question = req.body.qn;
    let Option1 = req.body.Option1;
    let Option2 = req.body.Option2;
    let Option3 = req.body.Option3;
    let Option4 = req.body.Option4;
    let CorrectAnswer = req.body.CorrectAnswer;
   // let HostID = res.body.HostID;

  // console.log(Question)

    let data = {Question:Question, Option1:Option1, Option2:Option2, Option3:Option3, Option4:Option4, CorrectAnswer:CorrectAnswer, HostID:'12345'};
    let sql = 'insert into questionBank SET ?';
    let query = db.query(sql, data, (err, result) => {
        if(!err){
            res.send(result)
        }
        //throw err;
    })
    // console.log(query);
})

app.get('/showQuestions', (req,res) => {
    let sql = 'select * from questionBank';
    let query = db.query(sql, (err, result) => {
        if(!err){
            res.send(result)
        }
    })
    console.log(query);
})





