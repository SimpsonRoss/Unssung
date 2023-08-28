// models/game.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameStatus = ['New', 'InProgress', 'Finished']

const gameSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    players: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    status: { type: String, enum: gameStatus, default: 'New' },
    roundCount: { type: Number, required: true, min: 1 },
    roundDuration: { type: Number, required: true, min: 1 },
    roundsArray: [{ type: Schema.Types.ObjectId, ref: 'Round', default: [] }],
    uniqueCode: { type: String, required: true },
    topTracks: [{ type: Array, default: [] }], 
    currentRound: { type: Schema.Types.ObjectId, ref: 'Round' },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);