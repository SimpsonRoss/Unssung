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

  // console.log(`track submissions: ${JSON.stringify(round.trackSubmissions)}`);

  const userSubmission = round.trackSubmissions.find(
    (submission) => submission.player.toString() === user._id.toString()
  );

  const userHasSubmitted = Boolean(userSubmission);


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
    <div>
      <h1>Round {round.roundNumber} Details</h1>
      <p>Game: {round.gameTitle}</p>
      <p>Status: {round.status}</p>
      <p>Duration: {round.duration} days</p>
      <p>Start Date: {startDate.toLocaleString()}</p>
      <p>Deadline to submit song: {songPickDeadline.toLocaleString()}</p>
      <p>Deadline to rate songs: {songScoreDeadline.toLocaleString()}</p>
      {
        (!userHasSubmitted && !submissionSuccess) ? 
        <TrackSubmissionForm roundId={id} userId={user._id} onSuccess={handleSuccessfulSubmit} />
        : <p>Song Submitted!</p>
      }
      {
        userHasSubmitted && <p>Your Song Submission: <a href={userSubmission.songId} target="_blank" rel="noopener noreferrer">{userSubmission.songId}</a></p>
      }
      {
        (round.status === 'SongScore') ?
        !scoreSubmitted ? // <-- Check if scores have been submitted
          <SongScoreForm 
            trackSubmissions={round.trackSubmissions} 
            userId={user._id} 
            roundId={id} 
            onSuccess={handleScoreSubmitSuccess} // <-- Call this function when scores are submitted
          />
          : <p>Scores Submitted!</p> // <-- Display this message if scores have been submitted
        : null
      }
      {
        (round.status !== 'SongPick') && (!savedPlaylist) && <button onClick={savePlaylistToSpotify}>Save to Spotify</button>
      }

      {
        (round.status === 'RevealScore') && <button onClick={revealScores}>Reveal Scores</button>
      }
      {
        (round.status === 'Finished') &&
        <div>
          <h2>Final Scores:</h2>
          {
            round.trackSubmissions.sort((a, b) => {
              const totalA = a.scores.reduce((acc, score) => acc + score, 0);
              const totalB = b.scores.reduce((acc, score) => acc + score, 0);
              return totalB - totalA;
            }).map(submission => (
              <p key={submission.songId}>
                {submission.songId} - Player: {submission.player === userSubmission.player ? "YOU" : submission.player} - Total Score: {submission.scores.reduce((acc, score) => acc + score, 0)}
              </p>
            ))
          }
        </div>
      }
      { (round.status !== 'SongPick') && (savedPlaylist) && <iframe
        title="Spotify Embed: Recommendation Playlist "
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="100%"
        style={{ minHeight: '360px' }}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />}
    </div>
  );
}
