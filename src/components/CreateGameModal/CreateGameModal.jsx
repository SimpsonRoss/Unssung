import { useState } from 'react';
import { createGame } from '../../utilities/games-api';


export default function CreateGameModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [roundCount, setRoundCount] = useState(0);
  const [roundDuration, setRoundDuration] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const game = await createGame({ title, roundCount, roundDuration });
      console.log("Game created:", game);
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error creating game:", err);
    }
  };

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <div>
        <button onClick={onClose}>Close</button>
        <h2>Create New Game</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Game Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input type="number" placeholder="Round Count" value={roundCount} onChange={(e) => setRoundCount(e.target.value)} />
          <input type="number" placeholder="Days Per Round" value={roundDuration} onChange={(e) => setRoundDuration(e.target.value)} />
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}