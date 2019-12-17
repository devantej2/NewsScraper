var mongoose = require("mongoose");

// Saving a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

// Creating model from above schema
var Article = mongoose.model("Article", ArticleSchema);

// Exporting the Article model
module.exports = Article;
