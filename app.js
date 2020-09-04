// package requirements
require("dotenv").config();
const express = require("express");
const app = express();
const request = require("request");
const bodyParser = require("body-parser");

// use statements and view setting
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const API_KEY = process.env.API_KEY;

// variable for titles
let titles = [];

// home page route
app.get("/", function(req, res) {
  res.render("home");
});

// search page route. Gets data from API and sends it to results page
app.get("/searchmovie", function(req, res) {
  let title = req.query["title"];
  if (title !== "") {
    console.log("Someone searched for '" + title + "'");
    request(
      "http://www.omdbapi.com/?s=" + title + "&apikey=" + API_KEY,
      function(error, response, body) {
        const parsedData = JSON.parse(body);
        for (let i = 0; i < parsedData.Search.length; i++) {
          titles.push(parsedData.Search[i]["Title"]);
        }
        res.render("results", { movies: parsedData.Search, titles: titles });
      }
    );
  } else {
    res.redirect("/");
  }
});

// more info page. Gets data from API using value generated on results page and renders it on singleMovie
app.get("/singleMovie", function(req, res) {
  let targetMovie = req.query.targetMovie;
  request(
    "http://www.omdbapi.com/?i=" +
      req.query.targetMovie +
      "&plot=full&apikey=" +
      API_KEY,
    function(error, response, body) {
      const movieData = JSON.parse(body);
      // console.log(movieData);
      res.render("singleMovie", { movieData: movieData });
    }
  );
});

// sets up the listener in Cloud 9
app.listen(3001, function() {
  console.log("Server has started.");
});
