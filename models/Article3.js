var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article3 = mongoose.model("Article3", ArticleSchema);


module.exports = Article3;
