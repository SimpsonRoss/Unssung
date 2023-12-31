import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

export default function RoundCard({ id, idx }) {
  const [round, setRound] = useState(null);

  useEffect(() => {
    const fetchRound = async () => {
      try {
        const res = await axios.get(`/api/rounds/${id}`);
        setRound(res.data);
      } catch (error) {
        console.error(`Error fetching round ${id}: ${error}`);
      }
    };
    fetchRound();
  }, [id]);

  const getStatusPhrase = (status) => {
    const phrases = {
      'SongPick': 'Submit a song!',
      'SongScore': 'Listen & score!',
      'RevealScore': 'Drumrollllll!',
      'Finished': 'Completed'
    };
    return phrases[status] || 'Unknown Status';
  };

  const getNextDeadline = () => {
    const now = new Date();
    const pickDeadline = new Date(round.songPickDeadline);
    const scoreDeadline = new Date(round.songScoreDeadline);

    // Determine which deadline is closest but hasn't passed
    if (round.status === 'SongPick' && pickDeadline > now) {
      return formatDate(pickDeadline);
    } else if (round.status === 'SongScore' && scoreDeadline > now) {
      return formatDate(scoreDeadline);
    } else {
      return 'None';
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  if (!round) {
    return <div>Loading round...</div>;
  }

  return (
    <Link to={`/rounds/${id}`}>
      <div className="Card">
        <h3>Round {round.roundNumber}</h3>
        <div className='tinyLine'></div>
        <p>{getStatusPhrase(round.status)}</p>
        {round.status === 'SongPick' || round.status === 'SongScore' ? 
        <>
        <p>Before deadline -</p>
        <p>{getNextDeadline()}</p>
        </>
        : 
        <>
        {round.status === 'Finished' ?
        <>
        <p>{round.winner} won!</p>
        </>
        : 
        <>
        <p>Scores are ready</p>
        <p>... lets go.</p>
        </>
         }
        </>
        }
      </div>
    </Link>
  );
}
