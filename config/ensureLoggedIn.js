// config/ensureLoggedIn.js

module.exports = function(req, res, next) {
  // Status code of 401 --> 'Unauthorized'
  if (!req.user) {
    console.log("Unauthorised - ensureLoggedIn.js")
    return res.status(401).json('Unauthorised');
  }
  // Okay!
  // console.log("Authorized - req.user = ", req.user)
  next();
};