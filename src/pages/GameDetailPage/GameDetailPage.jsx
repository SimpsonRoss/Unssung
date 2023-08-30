// src/pages/GameDetailPage/GameDetailPage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RoundCard from "../../components/RoundCard/RoundCard";

export default function GameDetailPage({ games, setGames }) {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [lastRoundStatus, setLastRoundStatus] = useState(null);

  useEffect(() => {
    const fetchedGame = games.find(g => g._id === id);
    setGame(fetchedGame);
    if (fetchedGame && fetchedGame.roundsArray) {
      setRounds(fetchedGame.roundsArray);
    }
  }, [games, id]);

  useEffect(() => {
    const fetchLastRoundStatus = async () => {
      if (rounds.length > 0) {
        const lastRoundId = rounds[rounds.length - 1];
        console.log('lastRoundId' + lastRoundId)
        try {
          const res = await axios.get(`/api/rounds/${lastRoundId}`);
          setLastRoundStatus(res.data.status);
        } catch (error) {
          console.error(`Error fetching last round's status: ${error}`);
        }
      }
    };

    fetchLastRoundStatus();
  }, [rounds]);

  const lastRoundFinished = !lastRoundStatus || lastRoundStatus === 'Finished';

  console.log('lastRoundFinished' + lastRoundFinished)
  const updateGame = async (action, data) => {
    try {
      const updatedGame = await axios.put(`/api/games/${id}/update`, {action, data});
      const updatedGames = games.map(g => (g._id === id ? updatedGame.data : g));
      setGames(updatedGames);
    } catch (error) {
      console.error(`Error updating game: ${error}`);
    }
  };
  
  if (!game) {
    return <div>Loading or Game not found...</div>;
  }
  const startGame = () => {
    updateGame('start', {});
    
  };
  
  const updateRoundCount = (changeBy) => {
    updateGame('updateRoundCount', { changeBy });
  };

  const updateRoundDuration = (changeBy) => {
    updateGame('updateRoundDuration', { changeBy });
  };

  const startRound = async () => {
    try {
      const newRound = await axios.post('/api/rounds/create', {
        duration: game.roundDuration,
        gameId: game._id,
        players: game.players,
      });
      // Temporarily calling this line below, just to clear the 'Start Round' button
      updateGame('start', {}); 
      setRounds([...rounds, newRound.data]);
    } catch (error) {
      console.error(`Error starting new round: ${error}`);
    }
  };
  

  return (
    <div>
      <h1>Title: {game.title}</h1>
      <p>Status: {game.status}</p>
      <p>Rounds: {game.roundCount}</p>
      <button onClick={() => updateRoundCount(-1)} disabled={game.roundCount <= 1}>- 1 Round</button>
      <button onClick={() => updateRoundCount(1)}>+ 1 Round</button>
      <p>Days per Round: {game.roundDuration}</p>
      <button onClick={() => updateRoundDuration(-1)} disabled={game.roundDuration <= 1}>- 1 Day</button>
    <button onClick={() => updateRoundDuration(1)}>+ 1 Day</button>
      {game.players.length > 1 ?
        <>
          <p>Number of Players: {game.players.length}</p>
          <p>Players: {game.players.map(player => player.name).join(game.players.length > 2 ? ', ' : ' & ')}</p>
        </>
        :
        <p>Players: No players yet. Game's must have 3 players minimum. Share your code with friends.</p>
      }
      <p>Invite Code: {game.uniqueCode}</p>
      {game.status === 'New' && game.players.length > 1 && <button onClick={startGame}>Start Game</button>}

      {/* Logic for showing 'Start Round' button */}
      { game.status === 'InProgress' && 
        lastRoundFinished && 
        game.roundsArray.length < game.roundCount && (
        <button onClick={startRound}>
          {`Start Round ${game.roundsArray.length + 1}`}
        </button>
      )}

      <div className="Dash-Row">
        {game.roundsArray && game.roundsArray.length > 0 ?
          game.roundsArray.map((round, idx) => {
            return <RoundCard id={round} idx={idx+1} key={idx} />;
          })
          :
          <p>No rounds to display just yet...</p>
        }
      </div>
    </div>
  );
}
