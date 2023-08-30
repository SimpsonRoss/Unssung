// routes/api/spotify.js

const express = require('express');
const router = express.Router();
const spotifyCtrl = require('../../controllers/api/spotify');
const ensureLoggedIn = require('../../config/ensureLoggedIn');



router.get('/login', spotifyCtrl.initiateSpotifyLogin);
router.get('/redirect', spotifyCtrl.handleSpotifyRedirect);
router.get('/refresh', spotifyCtrl.refreshAccessToken);
router.get('/top-tracks', spotifyCtrl.getTopTracks);
router.post('/create-playlist-api', spotifyCtrl.createPlaylistAPI);
router.get('/me', spotifyCtrl.getCurrentUserProfile);




module.exports = router;
