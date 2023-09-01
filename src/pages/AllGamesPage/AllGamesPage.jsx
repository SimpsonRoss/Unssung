// src/pages/AllGamesPage/AllGamesPage.jsx
import axios from 'axios';
import GameCard from "../../components/GameCard/GameCard";
import React, { useState } from 'react';
import CreateGameModal from '../../components/CreateGameModal/CreateGameModal';
import JoinGameModal from '../../components/JoinGameModal/JoinGameModal';

export default function AllGamesPage({ games, setGames }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);

  const handleOpenJoinModal = () => setIsJoinModalOpen(true);
  const handleCloseJoinModal = () => setIsJoinModalOpen(false);




  const handleJoinGame = async (uniqueCode) => {
    try {
      const response = await axios.put(`/api/games/join`, { uniqueCode });
      const joinedGame = response.data;
      setGames([...games, joinedGame]);
      setErrorMessage("");  // Clear any previous error messages
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      console.error(`Failed to join the game: ${error}`);
    }
  };

  const currentGames = games?.filter(game => game.status === 'New' || game.status === 'InProgress') || [];
  const finishedGames = games?.filter(game => game.status === 'Finished') || [];

  return (
    <div className="container dashContainer">
      {/* <h1>Your games</h1> */}
      <h1 className='mt-3 mb-3'>Your games</h1>
      <hr />
   
      {/* New and In Progress Games */}
      <h2 className='mt-5'>Current games</h2>
      <div className="game-row d-flex flex-row flex-nowrap">
        {currentGames.length > 0 ? currentGames.map((game, idx) => (
          <GameCard title={game.title} status={game.status} rounds={game.roundCount} id={game._id} players={game.players} key={idx} />
        )) : <p>No current games</p>}
      </div>
      <br />
      {/* Finished Games */}
      <h2>Past games</h2>
      <div className="game-row d-flex flex-row flex-nowrap">
        {finishedGames.length > 0 ? finishedGames.map((game, idx) => (
          <GameCard title={game.title} status={game.status} rounds={game.roundCount} id={game._id} players={game.players} key={idx} />
        )) : <p>No finished games</p>}
      </div>

      <br />
      
      <div className="w-100">
  <button className="btn btn-outline-light mt-2 equal-width-button" onClick={handleOpenCreateModal}>Create new game</button>
  <button className="btn btn-outline-light mt-2 equal-width-button" onClick={handleOpenJoinModal}>Join game</button>
</div>

      <CreateGameModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} />
      <JoinGameModal isOpen={isJoinModalOpen} onClose={handleCloseJoinModal} onJoinGame={handleJoinGame} />
        <br />
        <br />
      {errorMessage && <p className="error-message text-warning">{errorMessage}</p>}
      <br />
      <br />
      <br />
    </div>
  );
}