// controllers/api/game.js

const Round = require('../../models/round');
const Game = require('../../models/game');

module.exports = {
  create,
  fetchUserGames,
  updateGame,
  joinGame 
};

// Function to generate a unique code
function generateUniqueCode() {
  return Math.random().toString(36).substr(2, 9);
}

async function create(req, res) {
  const uniqueCode = generateUniqueCode();
  try {
    const game = await Game.create({
      ...req.body,
      owner: req.user._id,
      uniqueCode: uniqueCode 
    });
    res.status(201).json(game);
  } catch (err) {
    console.error("Error creating game:", err);
    res.status(400).json(err);
  }
}

async function fetchUserGames(req, res) {
  // console.log("fetchUserGames - req.user = ", req.user);
  try {
    const games = await Game.find({
      $or: [
        { owner: req.user._id },
        { players: req.user._id }
      ]
    }).populate('owner').populate('players');  // Removed the 'allRoundsArray' and 'currentRound' parts

    // console.log("fetchUserGames - games = ", games);

    res.status(200).json(games);
  } catch (err) {
    console.error("Error fetching user games:", err);
    res.status(400).json(err);
  }
}

async function updateGame(req, res) {
  const { id } = req.params;
  const { action, data } = req.body;
  try {
    const game = await Game.findById(id);
    if (action === 'start') {
      game.status = 'InProgress';
    } else if (action === 'updateRoundCount') {
      game.roundCount += data.changeBy;
      if (game.roundCount < 1) game.roundCount = 1;
    } else if (action === 'updateRoundDuration') {
      game.roundDuration += data.changeBy;
      if (game.roundDuration < 1) game.roundDuration = 1;
    }
    await game.save();
    res.status(200).json(game);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function joinGame(req, res) {
  const { uniqueCode } = req.body;
  try {
    const game = await Game.findOne({ uniqueCode: uniqueCode });
    if (!game) return res.status(404).json({ error: 'Game not found' });

    // Check if roundsArray is empty
    if (game.roundsArray && game.roundsArray.length > 0) {
      return res.status(400).json({ error: 'Game has already begun. Cannot join.' });
    }

    const playerId = req.session.userId;
    console.log("joinGame - playerId = ", playerId);
    game.players.push(playerId);
    await game.save();
    res.status(200).json(game);
  } catch (err) {
    console.error("Error joining game:", err);
    res.status(400).json(err);
  }
}