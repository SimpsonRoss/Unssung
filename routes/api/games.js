const express = require('express');
const router = express.Router();
const gamesCtrl = require('../../controllers/api/games');
const ensureLoggedIn = require('../../config/ensureLoggedIn');


router.post('/', ensureLoggedIn, gamesCtrl.create);

module.exports = router;