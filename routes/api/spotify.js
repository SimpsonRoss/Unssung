// routes/api/spotify.js

const express = require('express');
const router = express.Router();
const spotifyCtrl = require('../../controllers/api/spotify');

router.get('/login', spotifyCtrl.initiateSpotifyLogin);
router.get('/redirect', spotifyCtrl.handleSpotifyRedirect);
router.get('/refresh', spotifyCtrl.refreshAccessToken);

module.exports = router;
