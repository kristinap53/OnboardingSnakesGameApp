import React from 'react';

const PausedModal = ({ setIsPlaying }: { setIsPlaying: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <div className="modal">
      <h2>Game Paused</h2>
      <button onClick={() => setIsPlaying(true)}>Resume</button>
    </div>
  );
};

export default PausedModal;  