import React, { useEffect} from 'react';
import { initialState, SnakeGameState, updateGame } from './SnakeGameLogic';

interface SnakeBoardProps {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
    direction: string;
    setDirection: React.Dispatch<React.SetStateAction<string>>; 
}

const SnakeBoard: React.FC<SnakeBoardProps> = ({
  isPlaying,
  setIsPlaying,
  setScore,
  setIsGameOver,
  direction,
  setDirection,
}) => {
  const [gameState, setGameState] = React.useState<SnakeGameState>(initialState);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setGameState((prevState: SnakeGameState) => {
          const newState = updateGame(prevState, direction);
          //setScore(newState.score);
          if (newState.gameOver) {
            setIsGameOver(true);
            setIsPlaying(false);
          }
          return newState;
        });
      }, 200); 

      return () => clearInterval(interval);
    } else if (gameState.gameOver && gameState.score !== 0) {
      setGameState((prevState) => ({ ...initialState, score: prevState.score }));
    }
  }, [isPlaying, direction, setIsGameOver, setIsPlaying]);

  useEffect(() => {
    if (!gameState.gameOver) {
      setScore(gameState.score); 
    }
  }, [gameState.score]);

  useEffect(() => {
    if (!isPlaying && gameState.score > 0) {
      setScore(gameState.score); 
    }
  }, [isPlaying, gameState.score]);

  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        const isSnake = gameState.snake.some((segment) => segment.x === x && segment.y === y);
        const isApple = gameState.apple.x === x && gameState.apple.y === y;
        board.push(
          <div
            key={`${x}-${y}`}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: isSnake ? 'green' : isApple ? 'red' : '#fdf1e4',
              border: '1px solid #ccc',
            }}
          />
        );
      }
    }
    return board;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 30px)', gridTemplateRows: 'repeat(20, 30px)' }}>
      {renderBoard()}
    </div>
  );
};

export default SnakeBoard;