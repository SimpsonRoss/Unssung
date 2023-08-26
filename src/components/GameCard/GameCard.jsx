import { Link } from "react-router-dom";
import './GameCard.css';
 


export default function GameCard(props) {
  
  return (
    <>
      <Link to={"/games"}>
        <div className="GameCard">
          <h1>GameCard</h1>
          <p>the info about this game</p>
        </div>
      </Link>
    </>
  );
}