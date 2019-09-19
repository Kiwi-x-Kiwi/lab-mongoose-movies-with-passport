const express = require('express');
const router = express.Router();

const Movie = require("../models/Movie");
const Celebrity = require("../models/Celebrity");

/* GET home page */
router.get('/movies', (req, res, next) => {
  Movie.find({})
    .then(moviesFromDB=>{
      moviesFromDB.forEach((movie)=>{
        if (movie.user && req.user && movie.user.equals(req.user._id)) {
          movie.belongsToUser = true;
        }
      })
      res.render('movie-views/movies', { movies: moviesFromDB, user: req.user});
    })
    .catch(err => next(err))
});

router.post('/movies', (req, res, next) => {
  const newMovie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    plot: req.body.plot,
    celebs: req.body.celebs,
    user: req.user
  });

  newMovie.save()
    .then(responseFromDB =>{
      res.redirect("/movies")
    })
    .catch(err =>{
      console.error("Error, creating movie", err);
      res.redirect("/movies/new")
    })
});

router.get('/movies/new', (req, res, next) => {
  if(!req.user){
    res.redirect("/login");
  }
  Celebrity.find({})
    .then(resultFromDB => {
      res.render("movie-views/new", { celebs: resultFromDB, user: req.user})
    })
    .catch(err => next(err));
});

router.get('/movies/:id/edit', (req, res, next) => {
  Movie.findById(req.params.id)
    .then(movieFromDB => {
      if (!req.user || !movieFromDB.user) {
        res.redirect("/login")
        return;
      } else if (!movieFromDB.user.equals(req.user._id)) {
        res.redirect("/");
        return;
      }
      Celebrity.find({})
        .then(celebsFromDB => {
          celebsFromDB.forEach((eachCeleb)=>{
            if(eachCeleb._id.equals(movieFromDB.celebs)){
              eachCeleb.match = true;
              console.log(eachCeleb.match);
              
            }

          })
          console.log(celebsFromDB)
          res.render("movie-views/edit", { movie: movieFromDB, celebs: celebsFromDB, user: req.user})
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.post('/movies/:id/delete', (req, res, next) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(res.redirect("/movies"))
    .catch(err => next(err));
});

router.get('/movies/:id', (req, res, next) => {
  Movie.findById(req.params.id).populate("celebs")
  .then(movieFromDB => {
    if (movieFromDB.user && req.user && movieFromDB.user.equals(req.user._id)) {
      movieFromDB.belongsToUser = true;
    }
    res.render("movie-views/details", { movie: movieFromDB, user: req.user})
  })
  .catch(err => next(err))
});

router.post('/movies/:id', (req, res, next) => {
  const updatedMovie = {
    title: req.body.title,
    genre: req.body.genre,
    plot: req.body.plot,
    celebs: req.body.celebs
  };

  Movie.findByIdAndUpdate(req.params.id, updatedMovie)
  .then(resultFromDB => {
    res.redirect("/movies")
  })
  .catch(err => next(err))
});


module.exports = router;
