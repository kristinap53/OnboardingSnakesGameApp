export interface SnakeGameState {
    snake: { x: number; y: number }[]; // Snake body segments
    apple: { x: number; y: number }; 
    gameOver: boolean; 
    score: number; 
}

export const initialState: SnakeGameState = {
    snake: [
        { x: 2, y: 2 }, // starting position of the snake
    ],
    apple: { x: 5, y: 5 }, 
    gameOver: false,
    score: 0, 
};

export const updateGame = (state: SnakeGameState, direction: string): SnakeGameState => {
    let newSnake = [...state.snake];
    let newHead = { ...newSnake[0] };

    if (direction === 'UP') newHead.y -= 1;
    if (direction === 'DOWN') newHead.y += 1;
    if (direction === 'LEFT') newHead.x -= 1;
    if (direction === 'RIGHT') newHead.x += 1;

    newSnake.unshift(newHead); 

    // Check if the snake collides with itself or goes out of bounds
    if (newHead.x < 0 || newHead.x >= 20 || newHead.y < 0 || newHead.y >= 20 || newSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        return { ...state, gameOver: true }; // Game over if out of bounds or collision occurs
    }

    // Check if the snake eats the apple
    let newApple = state.apple;
    let newScore = state.score;

    if (newHead.x === state.apple.x && newHead.y === state.apple.y) {
        newApple = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) }; // Generate new apple position
        newScore += 10;
    } else {
        newSnake.pop(); 
    }

    return {
        snake: newSnake,
        apple: newApple,
        gameOver: state.gameOver,
        score: newScore, 
    };
};