// models/game.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameStatus = ['New', 'InProgress', 'Finished']

const gameSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    status: { type: String, enum: gameStatus, default: 'New' },
    roundCount: { type: Number, required: true },
    roundDuration: { type: Number, required: true },
    uniqueCode: { type: String, required: true },
    topTracks: [{ type: String }], 
    currentRound: { type: Schema.Types.ObjectId, ref: 'Round' },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);