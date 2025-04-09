import React from 'react';

interface GameOverModalProps {
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  finalScore: number;
  setJustStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ setIsGameOver, setIsPlaying, finalScore, setJustStarted, setScore }) => {
  const handleRestart = () => {
    setIsGameOver(false);
    setIsPlaying(true);
    setScore(0);
    setJustStarted(true);
  };

  return (
    <div className="modal">
      <h2>Game Over</h2>
      <p>Your score: {finalScore}</p>
      <button onClick={handleRestart}>Restart</button>
    </div>
  );
};

export default GameOverModal;