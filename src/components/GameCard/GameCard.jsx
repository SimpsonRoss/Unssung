import { Link } from "react-router-dom";
import './GameCard.css';

export default function GameCard(props) {

  const getGameStatusPhrase = () => {
    if (props.status === 'New') {
      return props.players.length < 3 ? 'Invite friends!' : 'Ready to begin?';
    } else if (props.status === 'InProgress') {
      return 'In play!';
    } else if (props.status === 'Finished') {
      return 'Completed';
    } else {
      return 'Unknown Status';
    }
  };

  return (
    <>
      <Link to={`/games/${props.id}`}>
        <div className="Card">
          <h3>{props.title}</h3>
          <div className='tinyLine'></div>
          <p>{getGameStatusPhrase()}</p>
          <p>Rounds - {props.rounds}</p>
          <p>Players - {props.players.length}</p>
        </div>
      </Link>
    </>
  );
}
