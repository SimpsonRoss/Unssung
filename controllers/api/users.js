//controllers/api/users.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');

module.exports = {
  create,
  login,
  getUser,
};

async function login(req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    // attempting to add user id to a session it can be called later
    req.session.userId = user._id;
    console.log('req.session.userId:', req.session.userId);
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    const token = createJWT(user);
    res.json(token);
  } catch {
    res.status(400).json('Bad Credentials');
  }
}

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);
    // The token is a string, but yes, we can
    // res.json a string
    res.json(token);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select('name'); // Fetch only the 'name' field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}

/*-- Helper Functions --*/
function createJWT(user) {
  return jwt.sign(
    // extra data for the payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}