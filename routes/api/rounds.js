const express = require('express');
const router = express.Router();
const roundController = require('../../controllers/api/rounds');

// Endpoint to create a new round
router.post('/create', roundController.createRound);

// Endpoint to fetch a round by ID
router.get('/:id', roundController.getRoundById);

router.post('/:id/submit', roundController.submitSong);


module.exports = router;