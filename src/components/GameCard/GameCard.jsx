import { Link } from "react-router-dom";
import './GameCard.css';
 


export default function GameCard(props) {
  
  return (
    <>
      <Link to={`/games/${props.id}`}>
        <div className="GameCard">
          <h1>{props.title}</h1>
          <p>Status: {props.status}</p>
          <p>Rounds: {props.rounds}</p>
          {/* +1 for the creator */}
          <p>Players: {props.players.length + 1}</p> 
        </div>
      </Link>
    </>
  );
}