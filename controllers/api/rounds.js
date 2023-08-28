const Round = require('../../models/round');
const Game = require('../../models/game');

exports.createRound = async (req, res) => {
  try {
    // Extract data from request
    const { gameId } = req.body;

    // Find the corresponding game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Calculate deadlines
    const now = new Date();
    const halfDuration = (game.roundDuration / 2) * 24 * 60 * 60 * 1000; // Half duration in milliseconds
    const fullDuration = game.roundDuration * 24 * 60 * 60 * 1000; // Full duration in milliseconds

    const songPickDeadline = new Date(now.getTime() + halfDuration);
    const songScoreDeadline = new Date(now.getTime() + fullDuration);
    
    // Create a new round
    const newRound = new Round({ 
      duration: game.roundDuration, 
      trackSubmissions: [],
      songPickDeadline,
      songScoreDeadline
     });
    
    await newRound.save();

    // Add this round to the corresponding game
    game.roundsArray.push(newRound._id);
    await game.save();
    
    res.status(201).json(newRound);
  } catch (error) {
    res.status(400).json({ message: 'Error creating round', error });
  }
};

exports.getRoundById = async (req, res, next) => {
  try {
    const round = await Round.findById(req.params.id);
    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }
    return res.status(200).json(round);
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred', error });
  }
};

exports.submitSong = async (req, res) => {
  const { id } = req.params;
  const { songURL, userId } = req.body;
  
  try {
    const round = await Round.findById(id);
    round.trackSubmissions.push({ songId: songURL, player: userId });
    await round.save();
    
    res.status(200).json(round);
  } catch (error) {
    res.status(400).json({ error });
  }
};