import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SongScoreForm({ trackSubmissions, userId, roundId }) {
  const [knows, setKnows] = useState({});
  const [ranks, setRanks] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Initialization of knows and ranks
  useEffect(() => {
    const initialKnows = {};
    const initialRanks = {};
    
    trackSubmissions.forEach(({ songId, player }) => {
      if (player.toString() !== userId.toString()) {
        initialKnows[songId] = 'Unknown';
        initialRanks[songId] = 1; // Initialize with a default rank
      }
    });
    
    setKnows(initialKnows);
    setRanks(initialRanks);
  }, [trackSubmissions, userId]);

  useEffect(() => {
    const allRanks = Object.values(ranks);
    const hasUniqueRanks = new Set(allRanks).size === allRanks.length;
    const hasAllRanks = allRanks.length === trackSubmissions.length - 1; // Exclude own song
    setIsFormValid(hasUniqueRanks && hasAllRanks);
  }, [ranks, trackSubmissions]);

  const handleChangeKnow = (songId, e) => {
    setKnows({ ...knows, [songId]: e.target.value });
  };

  const handleChangeRank = (songId, e) => {
    setRanks({ ...ranks, [songId]: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const multipliedScores = Object.keys(ranks).map((songId) => {
      const rank = ranks[songId];
      const knownFactor = knows[songId] === 'Known' ? 0.5 : 1;
      return { songId, score: rank * knownFactor };
    });
    console.log('multipliedScores: ', multipliedScores);


    try {
      await axios.post(`/api/rounds/${roundId}/submitScores`, { userId, multipliedScores });
      console.log('scores submitted');
    } catch (error) {
      console.error(`Error submitting scores: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Score Songs</h3>
      {trackSubmissions.map(({ songId, player }) => {
        if (player.toString() === userId.toString()) return null; // Skip the user's own song

        return (
          <div key={songId}>
            <p>Player: {player}</p>
            <a href={songId} target="_blank" rel="noopener noreferrer">{songId}</a>
            <select value={knows[songId]} onChange={(e) => handleChangeKnow(songId, e)}>
              <option value="Unknown">Unknown</option>
              <option value="Known">Known</option>
            </select>
            <select value={ranks[songId]} onChange={(e) => handleChangeRank(songId, e)}>
              {Array.from({ length: trackSubmissions.length - 1 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        );
      })}
      <button type="submit" disabled={!isFormValid}>Submit Scores</button>
    </form>
  );
}
