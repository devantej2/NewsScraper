const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });

// Scraping data from Website
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

      result.content = $(this)
        .children("a")
        .text();

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });
    res.render("scrape", {});
  });
});

// Splash page
app.get("/", (req, res) => {
  res.render("index");
});

//Route to get scraped articles

app.get("/unsaved-articles", (req, res) => {
  db.Article.find({})
    .limit(12)
    .then(function(data) {
      res.render("articles", { articles: data });
    })
    .catch(function(error) {
      res.json(error);
    });
});

app.get("/unsaved-articles/:id", (req, res) => {
  db.Article.find({ _id: req.params.id, saved: false })
    .then(function(data) {
      res.json(data);
    })
    .catch(function(error) {
      res.json(error);
    });
});

//Route to get scraped articles articles
app.get("/saved-articles", (req, res) => {
  db.Article.find({ saved: true })
    .then(function(data) {
      res.render("saved", { articles: data });
    })
    .catch(function(error) {
      res.json(error);
    });
});

// Retrieving comments associated with the article
app.get("/view-comments/:id", (req, res) => {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Adding the saved article
app.put("/unsaved-articles/:id", function(req, res) {
  // Update the article's boolean "saved" status to 'true.'
  db.Article.update({ _id: req.params.id }, { saved: true })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(error) {
      res.json(error);
    });
});

app.get("/saved", function(req, res) {
  // Update the article's boolean "saved" status to 'true.'
  db.Article.find({ saved: true })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(error) {
      res.json(error);
    });
});

// Removing the saved article
app.put("/unsave/:id", function(req, res) {
  db.Article.update({ _id: req.params.id }, { saved: false })
    .then(function(result) {
      res.json(result);
    })
    .catch(function(error) {
      res.json(error);
    });
});

// Saving comment for the associated article
app.post("/post-comment/:id", function(req, res) {
  //Creates a new comment using the information submitted
  db.Comment.create(req.body)
    .then(function(dbComment) {
      //Pushes the new Comment into that Article's "Comment" array
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { body: dbComment._id } },
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

// Deleting a comment from the associated article
app.delete("/delete-comment/:id", function(req, res) {
  db.Comment.remove({ _id: req.params.id })

    .then(function(dbDeleted) {
      res.json(dbDeleted);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
