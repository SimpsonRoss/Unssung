// src/utilities/games-api.js

import sendRequest from './send-request';
const BASE_URL = '/api/games';

export function createGame(gameData) {
  return sendRequest(BASE_URL, 'POST', gameData);
}

export function fetchUserGames() {
  return sendRequest(`${BASE_URL}/userGames`, 'GET');
}