const userAuth = (req, res, next) => {
  if(!req.user) null//do something

  next()
}


module.exports = userAuth