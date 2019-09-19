const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const movieSchema = new Schema({
  title: String,
  genre: String,
  plot: String,
  celebs: { type: mongoose.Schema.Types.ObjectId, ref: "Celebrity"},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
})

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;