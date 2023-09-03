import { Link } from "react-router-dom";
import './GameCard.css';
 


export default function GameCard(props) {
  
  return (
    <>
      <Link to={`/games/${props.id}`}>
        <div className="Card">
          <h3>{props.title}</h3>
          <div className='tinyLine'></div>
          <p>Status: {props.status}</p>
          <p>Rounds: {props.rounds}</p>
          <p>Players: {props.players.length}</p> 
        </div>
      </Link>
    </>
  );
}