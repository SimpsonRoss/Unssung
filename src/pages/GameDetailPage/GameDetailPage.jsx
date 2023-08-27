import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function GameDetailPage({ games, setGames }) {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchedGame = games.find(g => g._id === id);
    setGame(fetchedGame);
  }, [games, id]);

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
      {game.players.length > 0 ?
        <>
          <p>Number of Players: {game.players.length + 1}</p>
          <p>Players: {game.players.map(player => player.name).join(game.players.length > 2 ? ', ' : ' & ')}</p>
        </>
        :
        <p>Players: No players yet, invite some friends</p>
      }
      <p>Invite Code: {game.uniqueCode}</p>
      {game.status === 'New' && <button onClick={startGame}>Start Game</button>}
    </div>
  );
}
