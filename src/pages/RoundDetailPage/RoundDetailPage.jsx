// src/pages/RoundDetailPage/RoundDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrackSubmissionForm from '../../components/TrackSubmissionForm/TrackSubmissionForm';
import SongScoreForm from '../../components/SongScoreForm/SongScoreForm';
import axios from 'axios';
import { apiURLBackend, apiURLFrontend } from '../../utilities/config.js';


export default function RoundDetailPage({user}) {
  const { id } = useParams(); // id is the round id
  const [round, setRound] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [playlistId, setPlaylistId] = useState(null);
  const [savedPlaylist, setSavedPlaylist] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({});

  useEffect(() => {
    const fetchPlayerNames = async () => {
      const playerInfo = {};
      for (const submission of round.trackSubmissions) {
        const playerId = submission.player;
        try {
          const res = await axios.get(`/api/users/${playerId}`);
          if (res.data && res.data.name) {
            playerInfo[playerId] = { name: res.data.name, avatar: res.data.avatar };
          }
        } catch (error) {
          console.error(`Error fetching info for player ${playerId}: ${error}`);
        }
      }
      setPlayerInfo(playerInfo);
    };

    if (round) {
      fetchPlayerNames();
    }
  }, [round]);

  useEffect(() => {
    const fetchRound = async () => {
      try {
        const response = await axios.get(`/api/rounds/${id}`);
        setRound(response.data);
      } catch (error) {
        console.error(`Error fetching round: ${error}`);
      }
    };

    fetchRound();
  }, [id]);

  const handleSuccessfulSubmit = () => {
    setSubmissionSuccess(true);
  };

  const handleScoreSubmitSuccess = () => {
    setScoreSubmitted(true); 
  };

  if (!round) {
    return <div>Loading...</div>;
  }

  const userSubmission = round.trackSubmissions.find(
    (submission) => submission.player.toString() === user._id.toString()
  );

  const userHasSubmitted = Boolean(userSubmission);

  // Get the right suffix for the scores (e.g. 1st, 2nd, 3rd, 4th)
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

  const revealScores = async () => {
    try {
      await axios.put(`/api/rounds/${id}/revealScores`); 
      const response = await axios.get(`/api/rounds/${id}`);
      setRound(response.data);
    } catch (error) {
      console.error(`Error revealing scores: ${error}`);
    }
  };

  const savePlaylistToSpotify = async () => {
    // Dynamically collect the track URIs from the round's submissions
    const tracksUrls = round.trackSubmissions.map(submission => submission.songId);
    const tracksUri = tracksUrls.map(url => { 
      const urlParts = url.split('/');
      const trackId = urlParts[4].split('?')[0];
      return `spotify:track:${trackId}`;
    });
    console.log(round);

    const playlistInfo = {
      tracksUri,
      roundNumber: round.roundNumber,
      gameTitle: round.gameTitle,
      songScoreDeadline: round.songScoreDeadline
    };
    
    try {
      const response = await axios.post(`${apiURLBackend}/api/spotify/create-playlist-api`, playlistInfo, { withCredentials: true });
      setPlaylistId(response.data.playlistId);
      console.log(`Created playlist`);
      setSavedPlaylist(true);
    } catch (error) {
      console.error('Round Detail Page - Failed to create playlist:', error);
    }
  };

  // Convert timestamps to Date objects
  const startDate = new Date(round.createdAt);
  const songPickDeadline = new Date(round.songPickDeadline);
  const songScoreDeadline = new Date(round.songScoreDeadline);

  return (
    <div className="">
      <h1 className='mt-3 mb-3'>Round {round.roundNumber} Details</h1>
      <div className='customHr'></div>
      <div className=''>
      <h4 className='mb-4'>Game - {round.gameTitle}</h4>
      {/* <h4 className='mb-4'>Status: {round.status}</h4> */}
      {/* <h4 className='mb-4'>Duration: {round.duration} days</h4> */}
      { round.status === 'SongPick' ?
      <>
        <h4 className='mb-2 text-warning'>Submit your song by </h4>
        <h5 className='text-warning'>{songPickDeadline.toLocaleString()}</h5>
      </>
      : null 
      }
      { round.status === 'SongScore' ?
      <>
        <h4 className='mb-2'>Submit ratings by </h4>
        <h5>{songScoreDeadline.toLocaleString()}</h5>
      </>
      : null 
      }
      {
        (!userHasSubmitted && !submissionSuccess) ? 
        <TrackSubmissionForm roundId={id} userId={user._id} onSuccess={handleSuccessfulSubmit} />
        : 
        <>
        <h4 className='mt-4 mb-1'>Song submitted</h4>
        <p className='mb-2'>Waiting for all players to submit.</p>
        {/* COMMENTING OUT WHILST DEBUGGING THE SONG SUBMIT ERROR */}
        {/* <p className='mb-4'><a href={userSubmission.songId} target="_blank" rel="noopener noreferrer">{userSubmission.songId}</a></p> */}
        </>
      }

      {
        (round.status !== 'SongPick') && (!savedPlaylist) && <button className='btn btn-outline-light mt-2 mb-4' onClick={savePlaylistToSpotify}>Save playlist to Spotify</button>
      }
      <br />
      <div className='spotifyPlayer'>
      { (round.status !== 'SongPick') && (savedPlaylist) && <iframe
        title="Spotify Embed: Recommendation Playlist "
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="200%"
        style={{ minHeight: '180px' }}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />}
      </div>
      {
        (round.status === 'SongScore') ?
        !scoreSubmitted ? 
          <div className='songScoreForm d-flex'>
          <SongScoreForm 
            trackSubmissions={round.trackSubmissions} 
            userId={user._id} 
            roundId={id} 
            onSuccess={handleScoreSubmitSuccess} 
          />
          </div>
          : <p className='text-success1'>Scores submitted!</p> 
        : null
      }

      {
        (round.status === 'RevealScore') && <button className='btn btn-outline-light mb-4' onClick={revealScores}>Reveal scores</button>
      }
 {
        (round.status === 'Finished') &&
        <div>
          <h2 className='mt-2 mb-3'>Final Scores</h2>
          <ul className='list-group list-unstyled'>
          {
            round.trackSubmissions.sort((a, b) => {
              const totalA = a.scores.reduce((acc, score) => acc + score, 0);
              const totalB = b.scores.reduce((acc, score) => acc + score, 0);
              return totalB - totalA;
            }).map((submission, index) => {
              const place = index + 1;
              const suffix = getNumberSuffix(place);
              return (
                <li className='list-group-item-dark mb-3' key={submission.songId}>
                  <img className='miniPhoto mb-2'
                    src={playerInfo[submission.player]?.avatar || 'https://lh3.googleusercontent.com/a/AAcHTtdbTbALAxVdem0qmeAHIwErhMxZo1n4FTscpp9oWHQIPhsV=s288-c-no'}
                    alt={`${playerInfo[submission.player]?.name || submission.player}'s avatar`}
                    height="40px"
                  />
                  <h3>
                    {place}{suffix} Place - 
                    <span> {playerInfo[submission.player]?.name || "Unknown"}</span>
                  </h3>
                  <h5>
                    Score: {submission.scores.reduce((acc, score) => acc + score, 0)}
                  </h5>
                    {submission.songId}
                </li>
              );
            })}
            </ul>

        </div>
      }
      </div>
    <br />
    <br />
    <br />
    <br />

    </div>
  );
}
