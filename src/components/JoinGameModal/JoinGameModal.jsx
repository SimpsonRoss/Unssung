// src/components/JoinGameModal/JoinGameModal.jsx

import React, { useState } from 'react';

export default function JoinGameModal({ isOpen, onClose, onJoinGame }) {
  const [uniqueCode, setUniqueCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoinGame(uniqueCode);
    onClose();
  };

  return isOpen ? (
    <div>
      <h2>Join Game</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter Unique Code" 
          value={uniqueCode} 
          onChange={(e) => setUniqueCode(e.target.value)} 
        />
        <button type="submit">Join</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  ) : null;
}
