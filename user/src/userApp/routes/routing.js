const he = require('hydra-express');
const express = he.getExpress();
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const hydra = he.getHydra();
var app = express();

//creating connection with the mysql database
const connection = mysql.createConnection(
    {
        user: "root",
        password:"root",
        connectstring: "localhost",
        port: "3306",
        database: "movieDetails",
    }
)
console.log("running");
connection.connect(function (err) {
    if(err) throw err;
    console.log("Connected")
})

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//to create a new user
router.post('/createUser', function (req, res) {
    console.log("Request recieved to create a new user");
    var params  = req.body;
    console.log(params);
    connection.query('INSERT INTO userdetails SET `userName`=?, `emailId`=?, `password`=?, `phoneNo`=?, `role`="user"', [req.body.userName, req.body.emailId, req.body.password, req.body.phoneNo], function (error, results, fields) {
       if (error) throw error;
       res.send(JSON.stringify(results));
     });
});

//to login for an existing user
router.post('/login', function ( req, res) {
    console.log("Request recieved to login for an existing user");
    connection.query('SELECT `userName` FROM userdetails WHERE `userName`=? AND `password`=? AND `role`=?', [req.body.userName, req.body.password, req.body.role], function (error, results, fields) {
        if(error) throw error;
        console.log(results);
        if(results!=""){
            res.end(JSON.stringify(results));
            console.log("Login Successfull");
        }else{
            res.end("Invalid username and password!!");
            console.log("Login Failed")
        }
    })
})

module.exports = router;