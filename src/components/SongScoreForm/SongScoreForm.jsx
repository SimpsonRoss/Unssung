import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SongScoreForm({ trackSubmissions, userId, roundId, onSuccess }) {
  const [knows, setKnows] = useState({});
  const [ranks, setRanks] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const initialKnows = {};
    const initialRanks = {};
    
    trackSubmissions.forEach(({ songId, player }) => {
      if (player.toString() !== userId.toString()) {
        initialKnows[songId] = 'Unknown';
        initialRanks[songId] = 1;
      }
    });
    
    setKnows(initialKnows);
    setRanks(initialRanks);
  }, [trackSubmissions, userId]);

  useEffect(() => {
    const allRanks = Object.values(ranks);
    const hasUniqueRanks = new Set(allRanks).size === allRanks.length;
    const hasAllRanks = allRanks.length === trackSubmissions.length - 1;
    setIsFormValid(hasUniqueRanks && hasAllRanks);
  }, [ranks, trackSubmissions]);

  const handleChangeKnow = (songId, value) => {
    setKnows({ ...knows, [songId]: value });
  };

  const handleChangeRank = (songId, value) => {
    setRanks({ ...ranks, [songId]: parseInt(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const multipliedScores = Object.keys(ranks).map((songId) => {
      const rank = ranks[songId];
      const knownFactor = knows[songId] === 'Known' ? 0.5 : 1;
      return { songId, score: rank * knownFactor };
    });

    try {
      await axios.post(`/api/rounds/${roundId}/submitScores`, { userId, multipliedScores });
      console.log('scores submitted');
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.error(`Error submitting scores: ${error}`);
    }
  };

  
  return (
    <form onSubmit={handleSubmit}>
      <h3>Score songs</h3>
      <p className='text-success1'>Give each song a unique score from 1 to {trackSubmissions.length - 1}. <br />Mark whether you knew the song or not.</p>
      {trackSubmissions.map(({ songId, player }) => {
        if (player.toString() === userId.toString()) return null;

        return (
          <div key={songId}>
            <a href={songId} target="_blank" rel="noopener noreferrer">{songId}</a>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dropdown mt-2" style={{ width: 'calc(50% - 0.5vmin)' }} data-bs-theme="dark">
                <button className="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {knows[songId]}
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#" onClick={() => handleChangeKnow(songId, 'Unknown')}>Unknown</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => handleChangeKnow(songId, 'Known')}>Known</a></li>
                </ul>
              </div>
              <div style={{ width: '1vmin' }}></div> 
              <div className="dropdown mt-2 mb-3" style={{ width: 'calc(50% - 0.5vmin)' }} data-bs-theme="dark">
                <button className="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {ranks[songId] ? ranks[songId] : 'Score'}
                </button>
                <ul className="dropdown-menu">
                  {Array.from({ length: trackSubmissions.length - 1 }, (_, i) => i + 1).map((num) => (
                    <li key={num}><a className="dropdown-item" href="#" onClick={() => handleChangeRank(songId, num)}>{num}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
      <button className="btn btn-outline-light mt-2" type="submit" disabled={!isFormValid}>Submit scores</button>
    </form>
  );
}