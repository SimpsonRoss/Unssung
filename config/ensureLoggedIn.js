module.exports = function(req, res, next) {
  // Status code of 401 --> 'Unauthorized'
  if (!req.user) {
    console.log("Unauthorized")
    return res.status(401).json('Unauthorized');
  }
  // Okay!
  console.log("Authorized")
  next();
};