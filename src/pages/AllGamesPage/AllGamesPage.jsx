// src/pages/AllGamesPage/AllGamesPage.jsx
import axios from 'axios';
import GameCard from "../../components/GameCard/GameCard";
import React, { useState } from 'react';
import CreateGameModal from '../../components/CreateGameModal/CreateGameModal';
import JoinGameModal from '../../components/JoinGameModal/JoinGameModal';

export default function AllGamesPage({ games, setGames }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleOpenJoinModal = () => setIsJoinModalOpen(true);
  const handleCloseJoinModal = () => setIsJoinModalOpen(false);

  const handleJoinGame = async (uniqueCode) => {
    try {
      const response = await axios.put(`/api/games/join`, { uniqueCode });

      // Update the local state with the joined game.
      const joinedGame = response.data;
      setGames([...games, joinedGame]);
    } catch (error) {
      console.error(`Failed to join the game: ${error}`);
    }
  };

  return (
    <div className="Dash-Container">
      <h1>AllGamesPage</h1>
      <button onClick={handleOpenCreateModal}>Create New Game</button>
      <button onClick={handleOpenJoinModal}>Join Game</button>
      <CreateGameModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
      <JoinGameModal isOpen={isJoinModalOpen} onClose={handleCloseJoinModal} onJoinGame={handleJoinGame} />
      <div className="Dash-Row">
        { games ?
          games.map((game, idx) => {
          return <GameCard title={game.title} status={game.status} rounds={game.roundCount} id={game._id} players={game.players} key={idx} />})
          :
          <p>You haven't created or joined any games yet</p>
        }
      </div>
    </div>
  );
}
