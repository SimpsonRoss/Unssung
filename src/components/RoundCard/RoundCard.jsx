import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './RoundCard.css';

export default function RoundCard({ id, idx }) {
  const [round, setRound] = useState(null);

  console.log('idx' + idx)
  useEffect(() => {
    const fetchRound = async () => {
      try {
        console.log('fetching round' + id);
        const res = await axios.get(`/api/rounds/${id}`);
        console.log(res.data);  
        setRound(res.data);
      
      } catch (error) {
        console.error(`Error fetching round ${id}: ${error}`);
      }
    };

    fetchRound();
  }, [id]);

  if (!round) {
    return <div>Loading round...</div>;
  }

  return (
    <Link to={`/rounds/${id}`}>
      <div className="RoundCard">
        <h3>Round {idx}</h3>
        <p>Status: {round.status}</p>
        <p>id: {id}</p>
      </div>
    </Link>
  );
}
