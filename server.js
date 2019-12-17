const express = require("express");
var logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const Article = require("./Article");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });

app.get("/scrape", (req, res) => {
  axios.get("https://www.foxnews.com/sports").then(function(response) {
    let $ = cheerio.load(response.data);

    $("article h4").each(function(i, element) {
      let result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.send("Complete");
  });
});

app.get("/articles", (req, res) => {});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
