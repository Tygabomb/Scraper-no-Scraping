// Dependencies
    
const express = require("express");
const exphbs = require("express-handlebars");

const routes = require('./controller/routes.js')
const logger = require("morgan");

const mongoose = require("mongoose");

// Scraping tools 
// var axios = require("axios");
// var cheerio = require("cheerio");

// Require all models
// var db = require("./models");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

// Handlebars

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");


// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose

mongoose.connect(
  "mongodb://localhost/scraper-no-scraping", 
  { useNewUrlParser: true }
);
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper-no-scraping";

// mongoose.connect(MONGODB_URI);



// mongoose.connect("mongodb://heroku_thdwtncq:v0db4jti38s60tnr86cs97bvvo@ds161483.mlab.com:61483/heroku_thdwtncq");
// var db = mongoose.connection;

// Show any mongoose errors
// db.on("error", function(error) {
//   console.log("Mongoose Error: ", error);
// });

// // Once logged in to the db through mongoose, log a success message
// db.once("open", function() {
//   console.log("Mongoose connection successful.");
// });

app.listen(PORT, () => 
    console.log("App running on " + PORT + "🙈")
  );