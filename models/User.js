const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const MovieList = new Schema({
//   movie: {type: mongoose.Schema.Types.ObjectId, ref = "Movie"}
// })

const userSchema = new Schema({
  username: String,
  password: String,

  // role: String,

  googleID: String,
  image: String,
},{
  timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;