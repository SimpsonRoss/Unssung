const express = require('express');
const router = express.Router();
const gamesCtrl = require('../../controllers/api/games');
const ensureLoggedIn = require('../../config/ensureLoggedIn');


router.post('/', ensureLoggedIn, gamesCtrl.create);
router.get('/userGames', ensureLoggedIn, gamesCtrl.fetchUserGames);
router.put('/:id/update', gamesCtrl.updateGame);
router.put('/join', gamesCtrl.joinGame);


module.exports = router;