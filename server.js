const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

require('dotenv').config(); // Connect to db after the dotenv
require('./config/database');
require('./config/cronJobs'); // Importing the cron jobs

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

app.use(logger('dev'));
app.use(express.json());

// Dynamic CORS Configuration
const corsOrigin = isProduction ? 'https://trkr8-9a9586e5bb16.herokuapp.com' : 'http://localhost:3000';
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

// Dynamic Session Configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

if (isProduction) {
  sessionConfig.cookie = {
    secure: true, 
  };
}

app.use(session(sessionConfig));

app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

// Middleware to verify token and assign user object of payload to req.user.
app.use(require('./config/checkToken'));

// API routes
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
