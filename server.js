const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require("connect-redis").default;
const redis = require('redis');

require('dotenv').config(); // Connect to db after the dotenv
require('./config/database');
require('./config/cronJobs'); // Importing the cron jobs

const isProduction = process.env.NODE_ENV === 'production';

const client = isProduction ? 
  redis.createClient(process.env.REDIS_URL) : // Use the Heroku Redis URL in production
  redis.createClient({ host: '127.0.0.1', port: 6379 }); // Use local Redis in development

client.on('connect', () => {
  console.log('Redis client connected');
});

client.on('ready', () => {
  console.log('Redis is ready');
});

client.on('reconnecting', () => {
  console.log('Redis is reconnecting');
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('end', () => {
  console.log('Redis connection closed');
});

// Async function to set up Express app after Redis connection
(async () => {
  await client.connect();
  console.log('Redis client connected');

  const app = express();

  const sessionConfig = {
    store: new RedisStore({ client }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  };


  app.use(logger('dev'));
  app.use(express.json());

  // Dynamic CORS Configuration
  const corsOrigin = isProduction ? 'https://trkr8-9a9586e5bb16.herokuapp.com' : 'http://localhost:3000';
  app.use(cors({
    origin: corsOrigin,
    credentials: true
  }));

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
})();
