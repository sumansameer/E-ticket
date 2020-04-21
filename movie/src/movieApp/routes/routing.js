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

//to get all the movie details
router.get('/getMovies', function (req, res) {
    console.log("Request recieved to get the movies list from the database")
    connection.query('select * from movie', function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

//to add a new movie
router.post('/addMovie', function (req, res) {
    console.log("Request recieved to add a movie");
    var params  = req.body;
    console.log(params);
    connection.query('INSERT INTO movie SET ?', params, function (error, results, fields) {
       if (error) throw error;
       res.send(JSON.stringify(results));
     });
});

//to update movie details
router.put('/updateMovie', function (req, res) {
    console.log("Request recieved to update movie details");
    connection.query('SELECT * FROM movie WHERE `movieName`= ?', [req.body.movieName], function(error, results, fields) {
      if(error) throw error;
      if(results != ""){
        connection.query('UPDATE `movie` SET language`=?,`movieType`=?,`starring`=? where `movieName`=?', [req.body.language, req.body.movieType, req.body.starring, req.body.movieName], function (error, results, fields) {
          if (error) throw error;
          res.end(JSON.stringify(results));
        });
      } else {
        res.end("No such movie available");
      }
    });
 });

//to delete a movie
router.delete('/deleteMovie/:movieName', function (req, res) {
    console.log("Request recieved to delete a movie");
    console.log(req.body);
    connection.query('SELECT * FROM movie WHERE `movieName`= ?', [req.params.movieName], function(error, results, fields) {
      if(error) throw error;
      if(results != ""){
        connection.query('DELETE FROM `movie` WHERE `movieName`= ?', [req.params.movieName], function (error, results, fields) {
          if (error) throw error;
          res.end('Record has been deleted!');
        });
      } else {
        res.end("No such movie is there to delete");
      }
    })
    
});

//to get the show details about a particular movie
router.get('/showTheatres/:movieName', function(req, res) {
  console.log("Request recieved to get show details about a particular movie");
  connection.query('SELECT `theatreName`, `date`, `cost`, `remainingSeats` FROM shows WHERE `movieName`=?', [req.params.movieName], function (error, results, fields) {
    if(error) throw error;
    res.end(JSON.stringify(results));
  });
});

module.exports = router;