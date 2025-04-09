import React, { useState, useEffect } from 'react';
import SnakeBoard from './SnakesBoard';
import GameOverModal from './GameOverModal';
import PausedModal from './PausedModal';
import './styles.css';
import { getConnection, startConnection } from '.././signalRService';
import * as signalR from '@microsoft/signalr';

export default function SnakesGame() {
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [justStarted, setJustStarted] = useState(true);
  const [direction, setDirection] = useState<string>('RIGHT');
  const [highScore, setHighScore] = useState<number>(userData.highestScore || 0);

  const handleBodyClick = () => {
    if (justStarted) {
      setIsPlaying(true);
      setJustStarted(false);
      setScore(0);
      return;
    }
    if (!isGameOver) {
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (isGameOver && score > highScore) {
      const user = JSON.parse(sessionStorage.getItem('userData') || '{}');
  
      if (!user.email || !user.region) {
        console.error("User data is missing required fields.");
        return;
      }
  
      user.highestScore = score;
      sessionStorage.setItem('userData', JSON.stringify(user));
      setHighScore(score);
  
      const connection = getConnection();
      if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
        console.warn('SignalR connection is not established or disconnected. Starting connection...');
        startConnection().then(() => {
            console.log("SignalR connection established after attempt.");
        }).catch((err) => console.error("SignalR connection error:", err));
      } else {
          console.log("Connection already established.");
      }
      
      connection?.invoke("UpdateScore", connection.connectionId, {
        email: user.email,
        newScore: score,
        region: user.region
      }).catch(err => console.error("Error sending score update via SignalR:", err));

      return () => {
          connection?.off('UpdateScore');
      };
    }
  }, [isGameOver]); 

  const handlePlayAgain = async () => {
    setIsPlaying(false);     
    setTimeout(() => {
      setScore(0);            
      setIsGameOver(false);   
      setJustStarted(false); 
      setIsPlaying(true);     
    }, 0); 
  };


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'w') {
        setDirection('UP');
      } else if (event.key === 'ArrowDown' || event.key === 's') {
        setDirection('DOWN');
      } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        setDirection('LEFT');
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      id="snakes-game-container"
      onClick={handleBodyClick}
    >
      <h1 id="game-title" style={{ textAlign: 'center' }}>
        Snake Game
      </h1>
      <p className="high-score" style={{ fontSize: '18px' }}>
        High Score: {highScore}
      </p>

      {justStarted ? (
        <p className="new-game-hint" style={{ fontSize: '18px' }}>
          Click anywhere to start
        </p>
      ) : (
        <>
          <p className="score" style={{ fontSize: '18px' }}>
            <span>Score: </span>
            <span>{score}</span>
          </p>
        </>
      )}

      {!isGameOver && !justStarted && (
        <SnakeBoard
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            setScore={setScore}
            setIsGameOver={setIsGameOver}
            direction={direction}
            setDirection={setDirection}
        />
      )}

      {isGameOver && (
        <GameOverModal
          setIsGameOver={setIsGameOver}
          setIsPlaying={setIsPlaying}
          finalScore={score}
          setJustStarted={setJustStarted}
          setScore={setScore}
        />
      )}

      {justStarted
        ? ''
        : !isGameOver &&
          !isPlaying && <PausedModal setIsPlaying={setIsPlaying} />}

      {isGameOver && (
        <button className='play-again-button'
          onClick={handlePlayAgain}
          style={{
            
            cursor: 'pointer',
          }}
        >
          Play Again
        </button>
      )}
    </div>
  );
}