const he = require('hydra-express');
const express = he.getExpress();
const router = express.Router();
const mysql = require('mysql');
const bodyParser = require('body-parser');
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

//to get all the theatre details
router.get('/getTheatres', function (req, res) {
    console.log("Request recieved to get the theatre details from the database");
    connection.query('select * from theatre', function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

 //to add a new theatre
router.post('/addTheatre', function (req, res) {
    console.log("Request recieved to add a theatre");
    var params  = req.body;
    console.log(params);
    connection.query('INSERT INTO theatre SET ?', params, function (error, results, fields) {
       if (error) throw error;
       res.send(JSON.stringify(results));
     });
});

//to update theatre details
router.put('/updateTheatre', function (req, res) {
    console.log("Request recieved to update theatre details");
    connection.query('SELECT * FROM theatre WHERE `theatreName`= ?', [req.body.theatreName], function (error, results, fields) {
      if(error) throw error;
      if(results != "") {
        connection.query('UPDATE `theatre` SET `location`=?,`seatingCapacity`=? where `theatreName`=?', [req.body.location, req.body.seatingCapacity, req.body.theatreName], function (error, results, fields) {
          if (error) throw error;
          res.end(JSON.stringify(results));
        });
      } else {
        res.end("No such theatre available");
      }
    })
    
 });

//to delete a theatre
router.delete('/deleteTheatre/:theatreName', function (req, res) {
    console.log("Request recieved to delete a theatre");
    console.log(req.body);
    connection.query('SELECT * FROM theatre WHERE `theatreName`= ?', [req.params.theatreName], function (error, results, fields) {
      if(error) throw error;
      if(results != "") {
        connection.query('DELETE FROM `theatre` WHERE `theatreName`=?', [req.params.theatreName], function (error, results, fields) {
          if (error) throw error;
          res.end('Record has been deleted!');
        });
      } else {
        res.end("No such theatre is there to delete");
      }
    })
    
});

//to get show details in a particular theatre
router.get('/showMovies/:theatreName', function (req, res) {
    console.log("Request recieved to get the show details in a particular theatre");
    connection.query('SELECT `movieName`,`date`,`requiredSeats` FROM shows WHERE `theatreName`=?', [req.params.theatreName], function (error, results, fields) {
      if(error) throw error;
      res.end(JSON.stringify(results));
    });
});

 module.exports = router;