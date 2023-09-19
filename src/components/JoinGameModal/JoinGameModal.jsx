import React, { useState } from 'react';

export default function JoinGameModal({ isOpen, onClose, onJoinGame }) {
  const [uniqueCode, setUniqueCode] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // To store any error messages
  const modalClass = isOpen ? 'modal fade show d-block' : 'modal fade';

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const trimmedCode = uniqueCode.trim(); // Remove white spaces at both ends
  
    if (trimmedCode.length !== 9) {  // 9 characters long as per your generateUniqueCode function
      setErrorMessage("Code must be 9 characters long.");
      return;  // Stop execution
    }
    
    setErrorMessage(''); // Clear any previous error messages
    onJoinGame(trimmedCode);  // Pass the trimmed code
    onClose();
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
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-white modalStyle">
          <div className="modal-header text-center">
            <h5 className="modal-title modal-title position-absolute start-50 translate-middle-x">Join game</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <p>Unique code</p>
              <div className="form-floating mb-3">
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Enter Unique Code" 
                  value={uniqueCode} 
                  onChange={(e) => setUniqueCode(e.target.value)} 
                />
                <label>Code</label>
              </div>
              {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* Display error message if any */}
              <p>Enter the unique code to join a game.</p>
            </form>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-outline-light mx-auto" onClick={handleSubmit}>Join</button>
          </div>
        </div>
      </div>
    </div>
  );
}
