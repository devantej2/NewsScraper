// Requiring the dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");

// Making our models accessible
const db = require("./models");

// Configuring port for the server
const PORT = process.env.PORT || 3000;

const app = express();

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Middleware
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

//Connecting to mongo database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", (req, res) => {
  res.render("scrape");
});
// Scraping data from Website
app.get("/scrape", (req, res) => {
  axios.get("https://www.foxnews.com/sports").then(function(response) {
    let $ = cheerio.load(response.data);

    $("h4.title").each(function(i, element) {
      let result = {};

      result.title = $(element)
        .children("a")
        .text();

      result.link = $(element)
        .children("a")
        .attr("href");

      result.content = $(element)
        .parent()
        .siblings()
        .children("p")
        .text();

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.render("scrape");
  });
});

//Gets all Articles from the DB
app.get("/articles", function(req, res) {
  db.Article.find({})
    .limit(12)
    .sort({ field: "desc", _id: -1 })
    .then(function(dbArticle) {
      var articlesObject = {
        articles: dbArticle
      };
      res.render("index", articlesObject);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Getting all saved articles
app.get("/saved", function(req, res) {
  db.Article.find({ saved: true })
    .then(function(savedArticle) {
      res.render("saved", { articles: savedArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Getting a article by it's ID
app.get("/saved/:id", function(req, res) {
  db.Article.find({ _id: req.params.id, saved: true })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Gets a specific Article by ID & populates it with its Comments
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

/* =============== Saving/Removing Articles to/from Saved List =============*/
app.put("/saved/:id", function(req, res) {
  db.Article.update({ _id: req.params.id }, { saved: false })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(error) {
      res.json(error);
    });
});

app.put("/articles/:id", function(req, res) {
  db.Article.update({ _id: req.params.id }, { saved: true })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(error) {
      res.json(error);
    });
});

/* ========== Saving/Deleting Comments associated with the Article ==========*/
app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: dbComment._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/articles/:id", function(req, res) {
  db.Comment.findOneAndDelete({ _id: req.params.id })
    .then(function(dbDeleted) {
      res.json(dbDeleted);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
