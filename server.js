var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app= express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scrapedb");

app.get("/scrape", function(req, res) {
    axios.get("https://news.ycombinator.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("td class= title").each(function(i, element) {
            var result = {};

            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(scrapedb) {
                console.log(scrapedb);
            })
            .catch(function(err) {
                return res.json(err);
            });
        });
        res.send("Scrape complete");
    });
});

app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(scrapedb) {
        res.json(scrapedb);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(scrapedb) {
        res.json(scrapedb);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Comment.create(req.body)
    .then(function(scrapedb) {
        res.json(scrapedb);
    })
    .catch(function(err) {
        res.json(err);
    });
});


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});