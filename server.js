const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const session = require('express-session'); // Add this line

require('dotenv').config();
// Connect to db after the dotenv above
require('./config/database');

const app = express();

app.use(logger('dev'));
app.use(express.json());

// Add the session middleware here
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// Middleware to verify token and assign user object of payload to req.user.
app.use(require('./config/checkToken'));

// Put all API routes here (before the catch-all)
app.use('/api/users', require('./routes/api/users'));
app.use('/api/spotify', require('./routes/api/spotify'));
app.use('/api/games', require('./routes/api/games'));

// "catch-all" route
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5001;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`);
});
