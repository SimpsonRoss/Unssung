// config/cronJobs.js

const cron = require('node-cron');
const mongoose = require('mongoose');
const RoundModel = require('../models/round'); // Adjust path as needed

const defaultSongId = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=e59e07d581be4e26";

const updateRoundStatus = async () => {
  console.log('Running cron job to update round status');
  
  // Handle transition from 'SongPick' to 'SongScore'
  let rounds = await RoundModel.find({ status: 'SongPick', songPickDeadline: { $lt: new Date() }});
  
  for (const round of rounds) {
    const nonSubmitters = round.players.map(player => player.toString());
    for (const submission of round.trackSubmissions) {
      const index = nonSubmitters.indexOf(submission.player.toString());
      if (index !== -1) {
        nonSubmitters.splice(index, 1);
      }
    }
    for (const nonSubmitter of nonSubmitters) {
      round.trackSubmissions.push({
        songId: defaultSongId,
        player: nonSubmitter,
        scores: []
      });
    }
    round.status = 'SongScore';
    await round.save();
  }
  // Handle transition from 'SongScore' to 'RevealScore'
  rounds = await RoundModel.find({ status: 'SongScore', songScoreDeadline: { $lt: new Date() }});

  for (const round of rounds) {
    const playerCount = round.players.length;

    for (const submission of round.trackSubmissions) {
      const missingScores = playerCount - 1 - submission.scores.length;
      for (let i = 0; i < missingScores; i++) {
        submission.scores.push(playerCount);
      }
    }

    round.status = 'RevealScore';
    await round.save();
  }
};

// Run the job every minute, adjust as needed
cron.schedule('* * * * *', updateRoundStatus);