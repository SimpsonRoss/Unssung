// config/cronJobs.js

const cron = require('node-cron');
const mongoose = require('mongoose');
const RoundModel = require('../models/round'); // Adjust path as needed

const defaultSongId = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=e59e07d581be4e26";

const updateRoundStatus = async () => {
  console.log('Running cron job to update round status');
  // Find rounds with status 'SongPick' and where the current date is greater than the songPickDeadline
  const rounds = await RoundModel.find({ status: 'SongPick', songPickDeadline: { $lt: new Date() }});

  for (const round of rounds) {
    // Initialize array to hold IDs of players who haven't submitted a song
    const nonSubmitters = round.players.map(player => player.toString());

    // Remove players who have submitted a song from the nonSubmitters list
    for (const submission of round.trackSubmissions) {
      const index = nonSubmitters.indexOf(submission.player.toString());
      if (index !== -1) {
        nonSubmitters.splice(index, 1);
      }
    }

    console.log('Non-submitters:', nonSubmitters);
    console.log('Round players:', round.players);

    // For each player who hasn't submitted, add a default song
    for (const nonSubmitter of nonSubmitters) {
      round.trackSubmissions.push({
        songId: defaultSongId,
        player: nonSubmitter,
        scores: []
      });
    }

    // Update the round's status
    round.status = 'SongScore';
    await round.save();
  }
};

// Run the job every minute, adjust as needed
cron.schedule('* * * * *', updateRoundStatus);
