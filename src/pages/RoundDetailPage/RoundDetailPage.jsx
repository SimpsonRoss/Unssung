import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrackSubmissionForm from '../../components/TrackSubmissionForm/TrackSubmissionForm';
import SongScoreForm from '../../components/SongScoreForm/SongScoreForm';
import axios from 'axios';

export default function RoundDetailPage({user}) {
  const { id } = useParams(); // id is the round id
  const [round, setRound] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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

  if (!round) {
    return <div>Loading...</div>;
  }

  // console.log(`track submissions: ${JSON.stringify(round.trackSubmissions)}`);

  const userSubmission = round.trackSubmissions.find(
    (submission) => submission.player.toString() === user._id.toString()
  );

  const userHasSubmitted = Boolean(userSubmission);

  // Convert timestamps to Date objects
  const startDate = new Date(round.createdAt);
  const songPickDeadline = new Date(round.songPickDeadline);
  const songScoreDeadline = new Date(round.songScoreDeadline);

  return (
    <div>
      <h1>Round Details</h1>
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
        (round.status === 'SongScore') && <SongScoreForm trackSubmissions={round.trackSubmissions} userId={user._id} roundId={id}  />
      }
    </div>
  );
}
