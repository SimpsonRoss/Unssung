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
  const [playerInfo, setPlayerNames] = useState({}); 
  const [isCopied, setIsCopied] = useState(false);  // State for tooltip

  const handleCopyClick = () => {
    navigator.clipboard.writeText(game.uniqueCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      alert('Failed to copy text: ', err);
    });
  };

  const handleTextClick = (e) => {
    const text = e.target.innerText;
    navigator.clipboard.writeText(text);
  };

  
useEffect(() => {
  const fetchPlayerNames = async (game) => {
    const playerInfo = {};
    if (!game || !game.players) {
      return;
    }
    for (const player of game.players) {
      const playerId = player._id;       
      if (!playerId) {
        console.warn("Player ID is undefined");
        continue;
      } 
      try {
        const res = await axios.get(`/api/users/${playerId}`);
        if (res.data && res.data.name) {
          playerInfo[playerId] = { name: res.data.name, avatar: res.data.avatar };
        }
      } catch (error) {
        console.error(`Error fetching info for player ${playerId}: ${error}`);
      }
    }
    setPlayerNames(playerInfo);
  };

  const fetchedGame = games.find(g => g._id === id);
  if (fetchedGame) {
    fetchPlayerNames(fetchedGame);
  }
  setGame(fetchedGame);
}, [games, id]);

  useEffect(() => {
    const fetchAllRounds = async () => {
      try {
        const fetchedRounds = await Promise.all(
          game.roundsArray.map(async roundId => {
            const res = await axios.get(`/api/rounds/${roundId}`);
            return res.data;
          })
        );
        setRounds(fetchedRounds);
      } catch (error) {
        console.error(`Error fetching rounds: ${error}`);
      }
    };

    if (game && game.roundsArray.length > 0) {
      fetchAllRounds();
    }
  }, [game]);

  // console.log('rounds' + JSON.stringify(rounds))
  useEffect(() => {
    const fetchLastRoundStatus = async () => {
      if (rounds.length > 0) {
        const lastRoundId = rounds[rounds.length - 1]._id;
        // console.log('lastRoundId' + lastRoundId)
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

  const updateGame = async (action, data) => {
    try {
      const updatedGame = await axios.put(`/api/games/${id}/update`, {action, data});
      if (updatedGame.data) {
        const updatedGames = games.map(g => (g._id === id ? updatedGame.data : g));
        setGames(updatedGames);
      }
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

  const finishGame = async () => {
    updateGame('finish', {});
  };

  const calculatePlayerScores = () => {
    const playerScores = {};
    rounds.forEach((round) => {
      // console.log('round.trackSubmissions', round.trackSubmissions);
      round.trackSubmissions.forEach((submission) => {
        // console.log('submission.scores', submission.scores);
        const playerId = submission.player;
        const score = submission.scores.reduce((acc, cur) => acc + cur, 0);
        playerScores[playerId] = (playerScores[playerId] || 0) + score;
      });
    });
    // console.log('playerScores' + JSON.stringify(playerScores))


    const sortedPlayers = Object.entries(playerScores).sort((a, b) => b[1] - a[1]);
    // console.log('sortedPlayers' + JSON.stringify(sortedPlayers))
    return sortedPlayers;
  };

  const sortedPlayers = game && game.status === 'Finished' ? calculatePlayerScores() : [];

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
      if (newRound.data) {
        await updateGame('start', {});  // Added await here
        setRounds([...rounds, newRound.data]);
      }
    } catch (error) {
      console.error(`Error starting new round: ${error}`);
    }
  };
  const getNumberSuffix = (n) => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) {
      return 'st';
    }
    if (j === 2 && k !== 12) {
      return 'nd';
    }
    if (j === 3 && k !== 13) {
      return 'rd';
    }
    return 'th';
  };
  

  return (
    <div className="container">
      <h1 className='mt-3 mb-3'>{game.title}</h1>
      <hr />
      <h4 className='mb-4'>Game is {(game.status === 'New') || (game.status === 'InProgress') ? <span className='text-success1'>live</span> : <span className='text-danger'>over</span>}</h4>
      <section className='mb-4'>
      <h2 className='mb-1'>Rounds - {game.roundCount}</h2>
        { (game.status !== 'Finished') ?
        <>
        <button className="btn btn-outline-light equal-width-button mt-2" onClick={() => updateRoundCount(-1)} disabled={game.roundCount <= 1}>- 1 Round</button>
        <button className="btn btn-outline-light equal-width-button mt-2" onClick={() => updateRoundCount(1)}>+ 1 Round</button>
        </>
        : null 
        }
      </section>
      <section className='mb-2'>
      <h2 className='mb-1'>Days per round - {game.roundDuration}</h2>
        { (game.status !== 'Finished') ?
        <>
        <button className="btn btn-outline-light equal-width-button mt-2" onClick={() => updateRoundDuration(-1)} disabled={game.roundDuration <= 1}>- 1 Day</button>
        <button className="btn btn-outline-light equal-width-button mt-2" onClick={() => updateRoundDuration(1)}>+ 1 Day</button>
        </>
        : null 
        }
      </section>
      <br/>
      
      {game.players.length > 1 ?
        <>
          {/* <h4 className='mb-3'>Number of Players: {game.players.length}</h4> */}
          <h4 className='mb-2'>Players</h4>
          <h4 className='mb-4'><span className='text-success1'>{game.players.map(player => player.name).join(game.players.length > 2 ? ', ' : ' & ')}</span></h4>
        </>
        :
        <>
          <h4 className='mb-2'>Players</h4>
          <p>Share your code with friends. Game's need at least 3 players.</p>
        </>
      }


      { (game.status === 'New') ?
        <>
          <h4 className='mb-2'>Invite code </h4>
         
            <h4 className='text-success1 mb-2' onClick={handleTextClick}>{game.uniqueCode}</h4>
            <button className="btn btn-outline-light" onClick={handleCopyClick}>Copy</button>
            {isCopied && <p className="mt-2 text-success1">Copied!</p>}
          <br/>
          {game.status === 'New' && game.players.length > 2 && <button className="btn btn-outline-light mt-3" onClick={startGame}>Start game</button>}
        </>
        : null
      }



      {/* Logic for showing 'Start Round' button */}
      { game.status === 'InProgress' && 
        lastRoundFinished && 
        game.roundsArray.length < game.roundCount && (
        <button className="btn btn-outline-light" onClick={startRound}>
          {`Start Round ${game.roundsArray.length + 1}`}
        </button>
      )}

      <div className="game-row d-flex flex-row flex-nowrap">
        {game.roundsArray && game.roundsArray.length > 0
          ? [...game.roundsArray].reverse().map((round, idx, arr) => {
              return <RoundCard id={round} idx={arr.length - idx} key={idx} />;
            })
          : null}
      </div>

      {/* Logic for showing 'Finish Game' button */}
      {game.status === 'InProgress' && 
      lastRoundFinished && 
      game.roundsArray.length === game.roundCount && (
        <button className="btn btn-outline-light" onClick={finishGame}>Finish game</button>
      )}

      
    {/* Show the sorted players */}
    {game.status === 'Finished' && (
      <div>
        <h2 className='mt-3 mb-3'>Final scores</h2>
        <ul className='list-group list-unstyled'>
          {sortedPlayers.map(([playerId, score], index) => {
            const place = index + 1;
            const suffix = getNumberSuffix(place);
            return (
              <li className='list-group-item-dark mb-3' key={index}>
                <img className='miniPhoto mb-2'
                  src={playerInfo[playerId]?.avatar || 'https://lh3.googleusercontent.com/a/AAcHTtdbTbALAxVdem0qmeAHIwErhMxZo1n4FTscpp9oWHQIPhsV=s288-c-no'} 
                  alt={`${playerInfo[playerId]?.name || playerId}'s avatar`} 
                  height="40px" 
                />
                <h3>{place}{suffix} Place - <span>{playerInfo[playerId]?.name || playerId}</span></h3> {score} points
              </li>
            );
          })}
        </ul>
      </div>
    )}
      <br />
      <br />
      <br />
    
    </div>
  );
}
