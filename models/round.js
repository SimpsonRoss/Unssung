// models/round.js

const roundStatus = ['SongPick', 'SongScore', 'RevealScore', 'Finished'];

const roundSchema = new Schema({
    game: { type: Schema.Types.ObjectId, ref: 'Game' },
    duration: { type: Number, required: true, min: 1 },
    trackSubmissions: [{
      songId: String,
      player: { type: Schema.Types.ObjectId, ref: 'User' },
      score: Number 
    }],
    status: { type: String, enum: roundStatus, default: 'SongPick' },
    songPickDeadline: { type: Date, required: true },
    songScoreDeadline: { type: Date, required: true },
}, { timestamps: true });

function dateValidator(value) {
  return value > new Date();
}

module.exports = mongoose.model('Round', roundSchema);
