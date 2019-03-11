// Dependencies
const express = require("express"),
expHandlebars = require('express-handlebars'),
mongoose = require('mongoose'),
morgan = require('morgan');


// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Handlebars

app.engine("handlebars", expHandlebars({defaultLayout: "main"}));
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

//Routes
//=================
var routes = require("./controller/routes.js");
app.use("/",routes);


app.listen(PORT, () => 
    console.log("App running on " + PORT + "🙈")
  );