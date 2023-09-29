const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require("connect-redis").default;
const redis = require('redis');

require('dotenv').config();
require('./config/database');
require('./config/cronJobs');

const isProduction = process.env.NODE_ENV === 'production';

console.log('isProduction:', isProduction);
if (isProduction && !process.env.REDIS_TLS_URL) {
  console.error('REDIS_TLS_URL is not set. Exiting.');
  process.exit(1);
}

const client = isProduction ? 
  redis.createClient({
    url: process.env.REDIS_URL,
    tls: {
      rejectUnauthorized: false
    }
  }) :
  redis.createClient({ host: '127.0.0.1', port: 6379 });

console.log(`Connecting to Redis at ${process.env.REDIS_URL || '127.0.0.1:6379'}`);

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

(async () => {
  await client.connect();
  console.log('Redis client connected');

  const app = express();

  const sessionConfig = {
    store: new RedisStore({ client }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  };

  app.use(logger('dev'));
  app.use(express.json());

  const corsOrigin = isProduction ? 'https://trkr8-9a9586e5bb16.herokuapp.com' : 'http://localhost:3000';
  app.use(cors({
    origin: corsOrigin,
    credentials: true
  }));

  if (isProduction) {
    sessionConfig.cookie = {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    };
  }

  app.use(session(sessionConfig));
  app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'build')));

  app.use(require('./config/checkToken'));

  app.use('/api/users', require('./routes/api/users'));
  app.use('/api/spotify', require('./routes/api/spotify'));
  app.use('/api/games', require('./routes/api/games'));
  app.use('/api/rounds', require('./routes/api/rounds'));

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Express error:', err.stack);
    res.status(500).send('Internal Server Error');
  });

  const port = process.env.PORT || 5001;

  app.listen(port, function() {
    console.log(`Express app running on port ${port}`);
  });
})();
