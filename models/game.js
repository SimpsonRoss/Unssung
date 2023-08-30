// models/game.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameStatus = ['New', 'InProgress', 'Finished']

const gameSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'User', unique: true, default: [] }],
    status: { type: String, enum: gameStatus, default: 'New' },
    roundCount: { type: Number, required: true, min: 1 },
    roundDuration: { type: Number, required: true, min: 1 },
    roundsArray: [{ type: Schema.Types.ObjectId, ref: 'Round', default: [] }],
    uniqueCode: { type: String, required: true },
    topTracks: [{ type: Array, default: [] }], 
    currentRound: { type: Schema.Types.ObjectId, ref: 'Round' },
}, { timestamps: true });


// Pre-save hook to add owner to players array
gameSchema.pre('save', function(next) {
    console.log('Pre-save hook triggered for game:', this._id);
    console.log(this.players)
    // Convert ObjectIds to strings for comparison
    const ownerStr = this.owner.toString();
    const playersStr = this.players.map(player => player.toString());

    if (!playersStr.includes(ownerStr)) {
        this.players.push(this.owner);
    }
    next();
});

module.exports = mongoose.model('Game', gameSchema);