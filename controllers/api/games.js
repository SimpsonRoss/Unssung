// controllers/api/game.js

const Game = require('../../models/game');

module.exports = {
  create
};

async function create(req, res) {
  const game = await Game.create({
    ...req.body,
    owner: req.user._id,
  });
  res.status(201).json(game);
}