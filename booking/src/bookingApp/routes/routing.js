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

//to get all the bookings done
router.get('/getBooking', function (req, res) {
    console.log("Request recieved to get all the bookings done");
    connection.query('select * from booking', function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

//to book movie tickets
router.post('/bookTickets', function (req, res) {
    console.log("Request recieved to book tickets");
    var params = req.body;
    connection.query('select `remainingSeats` from shows where `movieName`= ? and `theatreName`= ?', [req.body.movieName, req.body.theatreName], function (error, results, fields) {
        if(error) {
            throw error;
        } else {
            console.log(fields);
            console.log(JSON.stringify(results));
            a = JSON.stringify(results);
            b = JSON.parse(a);
            console.log(b[0].remainingSeats);
            result = b[0].remainingSeats
            remainingSeats = result-req.body.noOftickets;
            console.log(remainingSeats);
            connection.query('UPDATE `shows` SET `remainingSeats`= ? WHERE `movieName`=? AND `theatreName`=?', [remainingSeats, req.body.movieName, req.body.theatreName], function (error, results, fields) {
                if (error) {
                    throw error;
                }else {
                    connection.query('SELECT `cost` FROM `shows` WHERE `movieName`= ? AND `theatreName`= ?', [req.body.movieName, req.body.theatreName], function (error, results, fields) {
                        if(error) {
                            throw error;
                        } else {
                            console.log(JSON.stringify(results));
                            c = JSON.stringify(results);
                            d = JSON.parse(c);
                            costperticket = d[0].cost;
                            nooftickets = req.body.noOftickets;
                            totalamount = costperticket * nooftickets;
                            connection.query('INSERT INTO booking SET `userName`= ?, `movieName`= ?, `theatreName`= ?, `date`= ?, `cost`= ?, `noOftickets`= ?', [req.body.userName, req.body.movieName, req.body.theatreName, req.body.date, totalamount, req.body.noOftickets], function (error, results, fields) {
                                if(error) {
                                    throw error;
                                } else {
                                    connection.query('INSERT INTO `report` SET `userName`= ?, `movieName`= ?, `theatreName`= ?, `noOftickets`= ?, `status`= "Booked"', [req.body.userName, req.body.movieName, req.body.theatreName, req.body.noOftickets], function(error, results, fields) {
                                        if(error) {
                                            throw error;
                                        } else {
                                            console.log("Inserted the report");
                                        }
                                    })
                                    res.send(JSON.stringify(results));
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})

//to cancel booked tickets
router.delete('/cancelTickets', function(req, res) {
    console.log("Request recieved to cancel the booked tickets");
    connection.query('SELECT `remainingSeats` FROM `shows` WHERE `movieName`= ? AND `theatreName`= ?', [req.body.movieName, req.body.theatreName], function(error, results, fields) {
        if(error) {
            throw error;
        } else {
            string1 = JSON.stringify(results);
            parsing = JSON.parse(string1);
            console.log(parsing[0].remainingSeats);
            result = parsing[0].remainingSeats;
            remainingSeats = result + Number(req.body.noOftickets);
            connection.query('UPDATE `shows` SET `remainingSeats`= ? WHERE `movieName`= ? AND `theatreName`= ?', [remainingSeats, req.body.movieName, req.body.theatreName], function(error, results, fields) {
                if(error) {
                    throw error;
                } else {
                    connection.query('DELETE FROM booking WHERE `movieName`= ? AND `theatreName`= ? AND `userName`= ?', [req.body.movieName, req.body.theatreName, req.body.userName], function(error, results, fields) {
                        if(error) {
                            throw error;
                        } else {
                            connection.query('INSERT INTO `report` SET `userName`= ?, `movieName`= ?, `theatreName`= ?, `noOftickets`= ?, `status`= "Cancelled"', [req.body.userName, req.body.movieName, req.body.theatreName, req.body.noOftickets], function(error, results, fields) {
                                if(error) {
                                    throw error;
                                } else {
                                    console.log("Inserted the report");
                                }
                            })
                            res.end("Record has been deleted");
                        }
                    })
                }
            })
        }
    })
})

//to get the generated report
router.get('/getReport', function(req, res) {
    console.log("Request recieved to get the generated report");
    connection.query('SELECT * FROM report', function( error, results, fields) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    })
})


module.exports = router;