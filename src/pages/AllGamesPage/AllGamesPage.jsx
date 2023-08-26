import GameCard from "../../components/GameCard/GameCard";
import React, { useState } from 'react';
import CreateGameModal from '../../components/CreateGameModal/CreateGameModal';


export default function AllGamesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="Dash-Container">
      <h1>AllGamesPage</h1>
      <button onClick={handleOpenModal}>Create New Game</button>
      <CreateGameModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <div className="Dash-Row">
      </div>
    </div>
  );
}