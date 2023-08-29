const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

require('dotenv').config();
// Connect to db after the dotenv above
require('./config/database');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000' 
}));

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
app.use('/api/rounds', require('./routes/api/rounds'));

// "catch-all" route
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 5001;

app.listen(port, function() {
  console.log(`Express app running on port ${port}`);
});
