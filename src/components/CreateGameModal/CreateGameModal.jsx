import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createGame } from '../../utilities/games-api';

export default function CreateGameModal({ isOpen, onClose, onCreateGame }) {
  const [title, setTitle] = useState("");
  const [roundCount, setRoundCount] = useState(4);
  const [roundDuration, setRoundDuration] = useState(7);
  const [error, setError] = useState(null); // for error messages

  const modalClass = isOpen ? 'modal fade show d-block' : 'modal fade';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // clear previous errors
    try {
      const game = await createGame({ title, roundCount, roundDuration });
      console.log("Game created:", game);
      if (typeof onCreateGame === 'function') {
        onCreateGame(game);
      }
      onClose(); // Close the modal
    } catch (err) {
      setError("Error creating game."); // set error message
      console.error("Error creating game:", err);
    }
  };

  const isValid = title.length > 0 && roundCount > 0 && roundDuration > 0;



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
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-white modalStyle">
          <div className="modal-header text-center">
            <h5 className="modal-title modal-title position-absolute start-50 translate-middle-x">Create a new game</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <p>Game title</p>
              <div className="form-floating mb-3">
                <input type="text" className="form-control" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='My new game'/>
                <label>Title</label>
              </div>
              <p>Number of rounds</p>
              <div className="form-floating mb-3">
                <input type="number" className="form-control" name="numRounds" placeholder="Enter number of rounds" value={roundCount} onChange={(e) => setRoundCount(e.target.value)} />
                <label>Rounds</label>
              </div>
              <p>Days per round</p>
              <div className="form-floating mb-3">
                <input type="number" className="form-control" name="daysPerRound" placeholder="Enter days per round" value={roundDuration} onChange={(e) => setRoundDuration(e.target.value)} />
                <label>Days</label>
              </div>
              {error && <p className="text-danger">{error}</p>}
              <p>pssst... the average is 4 rounds of 7 days.</p>
              <div className="modal-footer">
                <button type="submit" className="btn btn-outline-light mx-auto" disabled={!isValid}>Create game</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

CreateGameModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreateGame: PropTypes.func,
};
