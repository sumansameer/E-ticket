# E-ticket WS
Online Movie Ticket Booking application which helps users to book desired movies and theaters with ease.

## General info
This project is a movie ticketing system in which users can book or cancel tickets. They can view movie and theater details. The admin will be able to add, delete and update various components of the services.

## Technologies
* Technology: Node.js 
* Database:MySQL 
* Discovery Server: Redis  
* Framework: Express 
* Documentation: swagger.io 
* API gateway: Hydra-router 
* Registry: Redis Server 

## Setup
* For details on installation of Node.js, Click on https://nodejs.org/en/download/ 
* To download MySQL Server, Click on https://www.mysql.com/downloads/
* To download Postman for testing, Click on https://www.postman.com/downloads/

## Code Examples
* To add a new Movie into the system: The API example is shown:
`router.post('/addMovie', function (req, res) {
    console.log("Request recieved to add a movie");
    var params  = req.body;
    console.log(params);
    connection.query('INSERT INTO movie SET ?', params, function (error, results, fields) {
       if (error) throw error;
       res.send(JSON.stringify(results));
     });
});`

## Features
List of features ready aare as follows:
* User can register with the application and can login with password.
* Users can view and select various movies and theaters and book their tickets with desired number of seats. They can also cancel their booking.
* Admin can add/delete/update new movies, shows and theaters.


## Status
Project is in progress. The backend is completed. Proceeding with UI part.

## Contact
Created by [@sumansameer]- feel free to contact me!
