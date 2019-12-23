var mongoose = require("mongoose");

// Saving a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var CommentSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Must enter your name"
  },
  body: {
    type: String,
    trim: true,
    required: "Must enter a comment"
  }
});

// Creating model from above schema
var Comment = mongoose.model("Comment", CommentSchema);

// Exporting the Comment model
module.exports = Comment;
