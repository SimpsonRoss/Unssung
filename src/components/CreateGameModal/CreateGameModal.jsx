import React, { useState } from 'react';
import { createGame } from '../../utilities/games-api';

export default function CreateGameModal({ isOpen, onClose }) {
  const [title, setTitle] = useState("");
  const [roundCount, setRoundCount] = useState(0);
  const [roundDuration, setRoundDuration] = useState(0);

  const modalClass = isOpen ? 'modal fade show d-block' : 'modal fade';

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
    <div 
      className={modalClass} 
      tabIndex="-1" 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header text-center">
            <h5 className="modal-title modal-title position-absolute start-50 translate-middle-x">Create a New Game</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <p>Game Title</p>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='My new game'/>
                <label>Title</label>
              </div>
              <p>Number of Rounds</p>
              <div className="form-floating mb-3">
                <input type="number" className="form-control" name="numRounds" placeholder="Enter number of rounds" value={roundCount} onChange={(e) => setRoundCount(e.target.value)} />
                <label>Rounds</label>
              </div>
              <p>Days Per Round</p>
              <div className="form-floating mb-3">
                <input type="number" className="form-control" name="daysPerRound" placeholder="Enter days per round" value={roundDuration} onChange={(e) => setRoundDuration(e.target.value)} />
                <label>Days</label>
              </div>
              <p>pssst... the average is 4 rounds of 7 days.</p>
            </form>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-outline-light mx-auto" onClick={handleSubmit}>Create Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}
