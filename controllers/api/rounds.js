const Round = require('../../models/round');
const Game = require('../../models/game');
const User = require('../../models/user');

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
      players: game.players,
      roundNumber: game.roundsArray.length + 1,
      gameTitle: game.title,
      songPickDeadline,
      songScoreDeadline,
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
    
   // Check if all players have submitted their songs
    if (round.trackSubmissions.length === round.players.length) {
      round.status = 'SongScore';
    }
    
    
    await round.save();

    res.status(200).json(round);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.submitScores = async (req, res) => {
  const { id } = req.params; // Round ID
  const { userId, multipliedScores } = req.body; // Scores is an array of { songId, score }
  console.log('scores', multipliedScores);
  console.log('userId', userId);

  try {
    const round = await Round.findById(id);

    multipliedScores.forEach(({ songId, score }) => {
      const submission = round.trackSubmissions.find(s => s.songId === songId);
      if (submission) {
        submission.scores.push(score);
      }
    });

    // Check if all players have submitted their scores
    const allSongsScored = round.trackSubmissions.every(submission => {
      return submission.scores.length === round.players.length - 1;
    });

    // If all songs have been scored by all players, update the round status
    if (allSongsScored) {
      round.status = 'RevealScore';
    }

    await round.save();
    res.status(200).json(round);
  } catch (error) {
    res.status(400).json({ error });
  }
};



exports.revealScores = async (req, res) => {
  const { id } = req.params;
  try {
    const round = await Round.findById(id);
    
    if (round.status !== 'RevealScore') {
      return res.status(400).json({ message: 'Cannot reveal scores at this stage' });
    }

    let winnerSubmission = null;
    let highestScore = -1;

    for (const submission of round.trackSubmissions) {
      const totalScore = submission.scores.reduce((acc, score) => acc + score, 0);
      if (totalScore > highestScore) {
        highestScore = totalScore;
        winnerSubmission = submission;
      }
    }

    console.log('winnerSubmission', winnerSubmission);  // Debugging line

    if (winnerSubmission) {
      const winnerUser = await User.findById(winnerSubmission.player);
      if (winnerUser && winnerUser.name) {
        console.log('winnerUser', winnerUser); // Debugging line
        round.winner = winnerUser.name;
        
        // Save the round immediately after updating the winner
        await round.save();
      }
    }

    round.status = 'Finished';
    await round.save();

    res.status(200).json(round);
  } catch (error) {
    console.log("Error in revealScores:", error);  // Debugging line
    res.status(400).json({ error });
  }
};

