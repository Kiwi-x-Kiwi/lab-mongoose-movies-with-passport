const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/auth')
const Celebrity = require("../models/Celebrity");
const Movie = require("../models/Movie");


/** 
 * Get all celebrities
 * @example
 * GET /celebrities
 */
router.get('/celebrities', (req, res, next) => {
  Celebrity.find({})
    .then(celebsFromDB => {
      // console.log(celebsFromDB)
      celebsFromDB.forEach((celeb) => {
        if(celeb.user && req.user && celeb.user.equals(req.user._id)){
          
          celeb.belongsToUser = true;
        } else if (req.user && req.user.role == "admin"){
          celeb.belongsToUser = true;
        }
      })
      res.render('celebrity-views/celebrities', { celebs: celebsFromDB, user: req.user });
    })
    .catch(err => next(err))
});

router.post('/celebrities', userAuth, (req, res, next) => {
  const newCeleb = new Celebrity({
    name: req.body.name,
    occupation: req.body.occupation,
    catchPhrase: req.body.catchPhrase,
    movies: req.body.movies,
    user: req.user
  });

  newCeleb.save()
    .then(responseFromDB => {
      res.redirect("/celebrities")
    })
    .catch(err => {
      console.error("Error, creating character", err);
      res.redirect("/celebrities/new")
    })
});

router.get('/celebrities/new', (req, res, next) => {
  if(!req.user){
    res.redirect("/login")
  }
  Movie.find()
    .then(moviesFromDB => {
      res.render("celebrity-views/new", { movies: moviesFromDB, user: req.user })
    })
    .catch(err => next(err))
});

router.get('/celebrities/:id/edit', (req, res, next) => {
  Celebrity.findById(req.params.id)
    .then(resultFromDB => {
      if (!req.user || !resultFromDB.user){
        res.redirect("/login")
      } else if (!resultFromDB.user.equals(req.user._id) && !(req.user.role == "admin")){
        res.redirect("/");
      }
      Movie.find()
        .then(moviesFromDB => {
          moviesFromDB.forEach((movie) => {
            if (movie._id.equals(resultFromDB.movies)) {
              movie.match = true;
            }
          })
          res.render("Celebrity-views/edit", { celeb: resultFromDB, movies: moviesFromDB, user: req.user })
        })
    })
    .catch(err => next(err));
});

router.post('/celebrities/:id/delete', (req, res, next) => {
  Celebrity.findByIdAndDelete(req.params.id)
    .then(res.redirect("/celebrities"))
    .catch(err => next(err));
});

router.get('/celebrities/:id', (req, res, next) => {
  Celebrity.findById(req.params.id).populate("movies")
    .then(celebFromDB => {
      if (celebFromDB.user && req.user && celebFromDB.user.equals(req.user._id)){
        celebFromDB.belongsToUser = true;
      } else if (req.user && req.user.role == "admin"){
        celebFromDB.belongsToUser = true;
      }
      res.render("celebrity-views/details", { celeb: celebFromDB, user: req.user })
    })
    .catch(err => next(err))
});

router.post('/celebrities/:id', (req, res, next) => {
  const updatedCeleb = {
    name: req.body.name,
    occupation: req.body.occupation,
    catchPhrase: req.body.catchPhrase,
    movies: req.body.movies
  };

  Celebrity.findByIdAndUpdate(req.params.id, updatedCeleb)
    .then(resultFromDB => {
      res.redirect("/celebrities")
    })
    .catch(err => next(err))
});


module.exports = router;
