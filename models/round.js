// models/round.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roundStatus = ['SongPick', 'SongScore', 'RevealScore', 'Finished'];

const roundSchema = new Schema({
    
    duration: { type: Number, required: true, min: 1 },
    trackSubmissions: [{
      songId: String,
      player: { type: Schema.Types.ObjectId, ref: 'User' },
      scores: { type: [Number], default: [] }
    }],
    players: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    status: { type: String, enum: roundStatus, default: 'SongPick' },
    songPickDeadline: { type: Date, required: true },
    songScoreDeadline: { type: Date, required: true },
}, { timestamps: true });

// function dateValidator(value) {
//   return value > new Date();
// }

module.exports = mongoose.model('Round', roundSchema);
