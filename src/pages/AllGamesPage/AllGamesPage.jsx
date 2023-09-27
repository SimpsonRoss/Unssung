// src/pages/AllGamesPage/AllGamesPage.jsx
import axios from 'axios';
import GameCard from "../../components/GameCard/GameCard";
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CreateGameModal from '../../components/CreateGameModal/CreateGameModal';
import JoinGameModal from '../../components/JoinGameModal/JoinGameModal';

export default function AllGamesPage({ games, setGames, user }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modal = queryParams.get('modal');

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  
  const handleOpenJoinModal = () => setIsJoinModalOpen(true);
  const handleCloseJoinModal = () => setIsJoinModalOpen(false);

  useEffect(() => {
    if (currentUser && currentUser.spotifyAccessToken) {
      console.log('currentUser:', currentUser);
      console.log('currentUser.spotifyAccessToken:', currentUser.spotifyAccessToken);
      
      if (modal === 'createGame') {
        handleOpenCreateModal();
      }

      if (modal === 'joinGame') {
        handleOpenJoinModal();
      }
      // Clear the error message if conditions are met
      setErrorMessage("");
    } else if (!currentUser || !currentUser.spotifyAccessToken) {
      setErrorMessage("Go to your account page to connect Spotify.");
    }
  }, [location, currentUser]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`/api/users/${user._id}`);
        setCurrentUser(res.data);
      } catch (error) {
        console.error(`Failed to fetch current user: ${error}`);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleCreateGame = (newGame) => {
    setGames([...games, newGame]);
  };

  const handleCreateOrJoinGameClick = (handler) => {
    if (currentUser && currentUser.spotifyAccessToken) {
      handler();
    } else {
      setErrorMessage("Go to your account page to connect Spotify.");
    }
  };


  const handleJoinGame = async (uniqueCode) => {
    try {
      const response = await axios.put(`/api/games/join`, { uniqueCode });
      const joinedGame = response.data;
      console.log('Joined game data:', joinedGame);
      console.log('Games:', games);

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

  const sortByTimestampDesc = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

  const currentGames = games?.filter(game => game.status === 'New' || game.status === 'InProgress').sort(sortByTimestampDesc) || [];
  const finishedGames = games?.filter(game => game.status === 'Finished').sort(sortByTimestampDesc) || [];

  return (
    <div className="dashContainer">
      {/* <h1>Your games</h1> */}
      <h1 className='mt-3 mb-3'>Your games</h1>
      <div className='customHr'></div>
   
      {/* New and In Progress Games */}
      <h2 className='carouselTitle'>Current games</h2>
      <div className="game-row d-flex flex-row flex-nowrap">
        {currentGames.length > 0 ? currentGames.map((game, idx) => (
          <GameCard title={game.title} status={game.status} rounds={game.roundCount} id={game._id} players={game.players} key={idx} />
        )) : <p>No current games</p>}
      </div>
    
      {/* Finished Games */}
      <h2 className='carouselTitle'>Past games</h2>
      <div className="game-row d-flex flex-row flex-nowrap">
        {finishedGames.length > 0 ? finishedGames.map((game, idx) => (
          <GameCard title={game.title} status={game.status} rounds={game.roundCount} id={game._id} players={game.players} key={idx} />
        )) : <p>No finished games</p>}
      </div>

      <br />
      
      <div className="allGamesButtons">
  <button 
    className="btn btn-outline-light equal-width-button" 
    onClick={() => handleCreateOrJoinGameClick(handleOpenCreateModal)}
  >
    Create new game
  </button>
  <button 
    className="btn btn-outline-light equal-width-button" 
    onClick={() => handleCreateOrJoinGameClick(handleOpenJoinModal)}
  >
    Join game
  </button>
</div>

      <CreateGameModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} onCreateGame={handleCreateGame} />
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