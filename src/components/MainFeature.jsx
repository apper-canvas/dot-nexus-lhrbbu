import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

function MainFeature() {
  // Game configuration
  const [gridSize, setGridSize] = useState(4);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([
    { id: 'player1', name: "Player 1", score: 0, color: "primary" },
    { id: 'player2', name: "Player 2", score: 0, color: "secondary" }
  ]);
  
  // Available colors for players
  const playerColors = [
    "primary", "secondary", "amber-500", "emerald-500", 
    "violet-500", "rose-500", "cyan-500", "lime-500"
  ];
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  
  // Game state
  const [grid, setGrid] = useState([]);
  const [lines, setLines] = useState({});
  const [boxes, setBoxes] = useState({});
  
  const PlayIcon = getIcon('Play');
  const TrashIcon = getIcon('Trash');
  const SettingsIcon = getIcon('Settings');
  const UserIcon = getIcon('User');
  const UserPlusIcon = getIcon('UserPlus');
  const RefreshCwIcon = getIcon('RefreshCw');
  const MinusIcon = getIcon('Minus');
  const PlusIcon = getIcon('Plus');
  
  // Initialize or reset the game grid
  useEffect(() => {
    if (gameStarted) {
      initializeGrid();
    }
  }, [gameStarted, gridSize]);
  
  const initializeGrid = () => {
    // Create a grid of dots based on size
    const newGrid = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        newGrid.push({ row, col });
      }
    }
    setGrid(newGrid);
    setLines({});
    setBoxes({});
    // Reset player scores
    setPlayers(players.map(player => ({
      ...player, score: 0
    })));
    setCurrentPlayer('player1');
  };
  
  const handleStartGame = () => {
    setGameStarted(true);
    toast.info("Game started! Player 1's turn", {
      icon: "🎮"
    });
  };
  
  const handleResetGame = () => {
    setGameStarted(false);
    toast.info("Game reset", {
      icon: "🔄"
    });
  };
  
  const increaseSizeHandler = () => {
    if (gridSize < 8) {
      setGridSize(prev => prev + 1);
      if (gameStarted) {
        toast.info(`Grid size increased to ${gridSize + 1}x${gridSize + 1}`);
      }
    } else {
      toast.warning("Maximum grid size reached");
    }
  };
  
  const decreaseSizeHandler = () => {
    if (gridSize > 2) {
      setGridSize(prev => prev - 1);
      if (gameStarted) {
        toast.info(`Grid size decreased to ${gridSize - 1}x${gridSize - 1}`);
      }
    } else {
      toast.warning("Minimum grid size reached");
    }
  };

  // Add a new player to the game
  const addNewPlayer = () => {
    if (players.length >= 8) {
      toast.warning("Maximum 8 players allowed");
      return;
    }
    
    const newPlayerId = `player${players.length + 1}`;
    const availableColors = playerColors.filter(
      color => !players.some(player => player.color === color)
    );
    const newColor = availableColors[0] || playerColors[players.length % playerColors.length];
    
    setPlayers([
      ...players,
      { id: newPlayerId, name: `Player ${players.length + 1}`, score: 0, color: newColor }
    ]);
    
    toast.info("New player added!");
  };
  
  // Remove a player from the game
  const removePlayer = (playerId) => {
    if (players.length <= 2) {
      toast.warning("Minimum 2 players required");
      return;
    }
    
    // Find player index
    const playerIndex = players.findIndex(player => player.id === playerId);
    if (playerIndex === -1) return;
    
    // Remove player
    const updatedPlayers = [...players];
    updatedPlayers.splice(playerIndex, 1);
    
    // Update player IDs to maintain sequence
    const reindexedPlayers = updatedPlayers.map((player, index) => ({
      ...player, id: `player${index + 1}`
    }));
    setPlayers(reindexedPlayers);
  };
  
  // Logic to check if a line between two dots exists
  const lineExists = (row1, col1, row2, col2) => {
    const lineKey = `${row1},${col1}-${row2},${col2}`;
    const reversedLineKey = `${row2},${col2}-${row1},${col1}`;
    
    return lines[lineKey] || lines[reversedLineKey];
  };
  
  // Check if a box is completed and assign it to the current player
  const checkBoxCompletion = (row1, col1, row2, col2) => {
    let boxesCompleted = 0;
    
    // Check if line is horizontal
    if (row1 === row2) {
      // Check box above
      if (row1 > 0) {
        const topLeft = `${row1-1},${col1}`;
        const topRight = `${row1-1},${col2}`;
        const top = `${topLeft}-${topRight}`;
        const left = `${topLeft}-${row1},${col1}`;
        const right = `${topRight}-${row1},${col2}`;
        
        if (lineExists(row1-1, col1, row1-1, col2) && 
            lineExists(row1-1, col1, row1, col1) &&
            lineExists(row1-1, col2, row1, col2)) {
          const boxKey = `${row1-1},${col1}-${row1},${col2}`;
          if (!boxes[boxKey]) {
            // Update boxes with the current player's ID
            setBoxes(prev => ({ 
              ...prev, 
              [boxKey]: currentPlayer 
            }));
            
            // Update the current player's score
            setPlayers(prev => prev.map(player => {
              if (player.id === currentPlayer)
                return { ...player, score: player.score + 1 };
              return player;
            }));
            boxesCompleted++;
          }
        }
      }
      
      // Check box below
      if (row1 < gridSize - 1) {
        const bottomLeft = `${row1+1},${col1}`;
        const bottomRight = `${row1+1},${col2}`;
        const bottom = `${bottomLeft}-${bottomRight}`;
        const left = `${row1},${col1}-${bottomLeft}`;
        const right = `${row1},${col2}-${bottomRight}`;
        
        if (lineExists(row1+1, col1, row1+1, col2) && 
            lineExists(row1, col1, row1+1, col1) && 
            lineExists(row1, col2, row1+1, col2)) {
          const boxKey = `${row1},${col1}-${row1+1},${col2}`;
          if (!boxes[boxKey]) {
            // Update boxes with the current player's ID
            setBoxes(prev => ({ 
              ...prev, 
              [boxKey]: currentPlayer 
            }));
            
            // Update the current player's score
            setPlayers(prev => prev.map(player => {
              if (player.id === currentPlayer)
                return { ...player, score: player.score + 1 };
              return player;
            }));
            boxesCompleted++;
          }
        }
      }
    }
    
    // Check if line is vertical
    if (col1 === col2) {
      // Check box to the left
      if (col1 > 0) {
        const topLeft = `${row1},${col1-1}`;
        const bottomLeft = `${row2},${col1-1}`;
        const left = `${topLeft}-${bottomLeft}`;
        const top = `${topLeft}-${row1},${col1}`;
        const bottom = `${bottomLeft}-${row2},${col2}`;
        
        if (lineExists(row1, col1-1, row2, col1-1) && 
            lineExists(row1, col1-1, row1, col1) && 
            lineExists(row2, col1-1, row2, col1)) {
          const boxKey = `${row1},${col1-1}-${row2},${col1}`;
          if (!boxes[boxKey]) {
            // Update boxes with the current player's ID
            setBoxes(prev => ({ 
              ...prev, 
              [boxKey]: currentPlayer 
            }));
            
            // Update the current player's score
            setPlayers(prev => prev.map(player => {
              if (player.id === currentPlayer)
                return { ...player, score: player.score + 1 };
              return player;
            }));
            boxesCompleted++;
          }
        }
      }
      
      // Check box to the right
      if (col1 < gridSize - 1) {
        const topRight = `${row1},${col1+1}`;
        const bottomRight = `${row2},${col1+1}`;
        const right = `${topRight}-${bottomRight}`;
        const top = `${row1},${col1}-${topRight}`;
        const bottom = `${row2},${col2}-${bottomRight}`;
        
        if (lineExists(row1, col1+1, row2, col1+1) && 
            lineExists(row1, col1, row1, col1+1) && 
            lineExists(row2, col2, row2, col1+1)) {
          const boxKey = `${row1},${col1}-${row2},${col1+1}`;
          if (!boxes[boxKey]) {
            // Update boxes with the current player's ID
            setBoxes(prev => ({ 
              ...prev, 
              [boxKey]: currentPlayer 
            }));
            
            // Update the current player's score
            setPlayers(prev => prev.map(player => {
              if (player.id === currentPlayer)
                return { ...player, score: player.score + 1 };
              return player;
            }));
            boxesCompleted++;
          }
        }
      }
    }
    
    return boxesCompleted;
  };
  
  // Handle click on a line between dots
  const handleLineClick = (row1, col1, row2, col2) => {
    if (!gameStarted) return;
    
    // Ensure consistent ordering of dots
    if (row1 > row2 || (row1 === row2 && col1 > col2)) {
      [row1, col1, row2, col2] = [row2, col2, row1, col1];
    }
    
    // Check if line already exists
    const lineKey = `${row1},${col1}-${row2},${col2}`;
    if (lines[lineKey]) return;
    
    // Update lines
    setLines(prev => ({ ...prev, [lineKey]: currentPlayer }));
    
    // Check if any boxes were completed
    const boxesCompleted = checkBoxCompletion(row1, col1, row2, col2);
    
    // Change turn if no boxes were completed
    if (boxesCompleted === 0) {
      // Find current player index
      const currentPlayerIndex = players.findIndex(player => player.id === currentPlayer);
      if (currentPlayerIndex === -1) return;
      
      // Move to next player (loop back to first player if at the end)
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      const nextPlayer = players[nextPlayerIndex].id;
      
      
      // Update current player
      setCurrentPlayer(nextPlayer);
      // Get player name from the players array
      const nextPlayerName = players[nextPlayerIndex].name;
      toast.info(`${nextPlayerName}'s turn`, { autoClose: 1500 });
    } else {
      const currentPlayerInfo = players.find(player => player.id === currentPlayer);
      toast.success(`${currentPlayerInfo.name} completed ${boxesCompleted} box${boxesCompleted > 1 ? 'es' : ''}!`, {
        autoClose: 3000
      });
      
      // Check if game is over (all possible boxes filled)
      const totalBoxes = (gridSize - 1) * (gridSize - 1);
      const filledBoxes = Object.keys(boxes).length + boxesCompleted;
      
      if (filledBoxes >= totalBoxes) {
        // Find player with the highest score
        const highestScore = Math.max(...players.map(player => player.score));
        const winners = players.filter(player => player.score === highestScore);
        
        let winnerMessage;
        if (winners.length > 1) {
          // Multiple winners - it's a tie
          const winnerNames = winners.map(player => player.name).join(' and ');
          winnerMessage = `It's a tie between ${winnerNames}!`;
        } else {
          winnerMessage = `${winners[0].name} wins!`;
        }
            
        toast.success(`Game Over! ${winnerMessage}`, {
          icon: "🏆",
          autoClose: false
        });
      }
    }
  };
  
  // Rendering the game grid
  const renderGrid = () => {
    if (!gameStarted) return null;
    
    const gridItems = [];
    
    // Draw boxes first (as background)
    for (let row = 0; row < gridSize - 1; row++) {
      for (let col = 0; col < gridSize - 1; col++) {
        const boxKey = `${row},${col}-${row+1},${col+1}`;
        const ownerClass = boxes[boxKey] ? `box-${boxes[boxKey]}` : '';
        // Find the player who owns this box
        const boxOwner = boxes[boxKey];
        // Get the player's color if the box has an owner
        const playerColor = boxOwner ? players.find(p => p.id === boxOwner)?.color : null;
        // Apply background color with opacity
        const style = {
          top: `${(row * 100) / (gridSize - 1)}%`,
          left: `${(col * 100) / (gridSize - 1)}%`,
          width: `${100 / (gridSize - 1)}%`,
          height: `${100 / (gridSize - 1)}%`,
          backgroundColor: playerColor ? `var(--tw-color-${playerColor})` : 'transparent',
          opacity: playerColor ? 0.3 : 0
        };
        
        gridItems.push(
          <div key={`box-${row}-${col}`} className="absolute transition-colors duration-300" style={style}
          />
        );
      }
    }
    
    // Draw horizontal lines
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize - 1; col++) {
        const lineKey = `${row},${col}-${row},${col+1}`;
        // Find the player who owns this line
        const lineOwner = lines[lineKey];
        const playerColor = lineOwner ? players.find(p => p.id === lineOwner)?.color : null;
        const hoverClass = !lineOwner ? 'hover:bg-surface-400 dark:hover:bg-surface-500' : '';
        const lineClassBase = playerColor ? `bg-${playerColor}` : `bg-surface-300 dark:bg-surface-600 ${hoverClass}`;
        
        gridItems.push(
          <div 
            key={`h-${row}-${col}`}
            className={`absolute cursor-pointer transition-colors duration-200 ${lineClassBase}`}
            style={{
              top: `calc(${(row * 100) / (gridSize - 1)}% - 2px)`,
              left: `${(col * 100) / (gridSize - 1)}%`,
              width: `${100 / (gridSize - 1)}%`,
              height: '4px',
            }}
            onClick={() => handleLineClick(row, col, row, col+1)}
          />
        );
      }
    }
    
    // Draw vertical lines
    for (let row = 0; row < gridSize - 1; row++) {
      for (let col = 0; col < gridSize; col++) {
        const lineKey = `${row},${col}-${row+1},${col}`;
        // Find the player who owns this line
        const lineOwner = lines[lineKey];
        const playerColor = lineOwner ? players.find(p => p.id === lineOwner)?.color : null;
        const hoverClass = !lineOwner ? 'hover:bg-surface-400 dark:hover:bg-surface-500' : '';
        const lineClassBase = playerColor ? `bg-${playerColor}` : `bg-surface-300 dark:bg-surface-600 ${hoverClass}`;
        
        gridItems.push(
          <div 
            key={`v-${row}-${col}`}
            className={`absolute cursor-pointer transition-colors duration-200 ${lineClassBase}`}
            style={{
              top: `${(row * 100) / (gridSize - 1)}%`,
              left: `calc(${(col * 100) / (gridSize - 1)}% - 2px)`,
              width: '4px',
              height: `${100 / (gridSize - 1)}%`,
            }}
            onClick={() => handleLineClick(row, col, row+1, col)}
          />
        );
      }
    }
    
    // Draw dots on top
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        gridItems.push(
          <div 
            key={`dot-${row}-${col}`}
            className="absolute w-3 h-3 rounded-full bg-surface-700 dark:bg-surface-300 z-10"
            style={{
              top: `calc(${(row * 100) / (gridSize - 1)}% - 6px)`,
              left: `calc(${(col * 100) / (gridSize - 1)}% - 6px)`,
            }}
          />
        );
      }
    }
    
    return gridItems;
  };

  return (
    <div className="card overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
          {gameStarted ? 'Connect the Dots' : 'Start a New Game'}
        </h2>
        
        <div className="flex items-center gap-3">
          {!gameStarted ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseSizeHandler}
                  className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                  aria-label="Decrease grid size"
                >
                  <MinusIcon size={18} />
                </button>
                
                <div className="min-w-[80px] text-center">
                  <span className="text-surface-700 dark:text-surface-300 font-medium">
                    {gridSize}×{gridSize} Grid
                  </span>
                </div>
                
                <button
                  onClick={increaseSizeHandler}
                  className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                  aria-label="Increase grid size"
                >
                  <PlusIcon size={18} />
                </button>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartGame}
                className="btn-primary flex items-center gap-2"
              >
                <PlayIcon size={18} />
                <span>Start Game</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetGame}
              className="btn-outline flex items-center gap-2"
            >
              <RefreshCwIcon size={18} />
              <span>Reset Game</span>
            </motion.button>
          )}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {!gameStarted ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface-100/50 dark:bg-surface-800/50 rounded-xl p-6 mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Player Setup</h3>
              <button 
                onClick={addNewPlayer}
                className="btn-outline-secondary flex items-center gap-2 text-sm"
                disabled={players.length >= 8}
              >
                <UserPlusIcon size={16} />
                <span>Add Player</span>
              </button>
            </div>
            
            <LayoutGroup>
              <div className="space-y-4">
                {players.map((player, index) => (
                  <motion.div 
                    key={player.id}
                    layout
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-200/50 dark:bg-surface-700/50"
                  >
                    <div className={`w-6 h-6 rounded-full bg-${player.color}`} />
                    
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => {
                        const updatedPlayers = [...players];
                        updatedPlayers[index].name = e.target.value;
                        setPlayers(updatedPlayers);
                      }}
                      placeholder="Enter name"
                      className="input flex-1"
                    />
                    
                    <button onClick={() => removePlayer(player.id)} className="text-red-500 hover:text-red-700 p-1" disabled={players.length <= 2}>
                      <TrashIcon size={18} />
                    </button>
                  </motion.div>
                ))}
                </div>
            </LayoutGroup>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col md:flex-row gap-6"
          >
            <div className="w-full md:w-2/3">
              <div 
                className="relative w-full aspect-square bg-surface-100 dark:bg-surface-800 rounded-xl overflow-hidden"
                style={{ maxWidth: '500px', margin: '0 auto' }}
              >
                {renderGrid()}
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <div className="bg-surface-100/50 dark:bg-surface-800/50 rounded-xl p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Current Turn</h3>
                {players.map(player => {
                  if (player.id === currentPlayer) {
                    return (
                      <div 
                        key={player.id}
                        className={`p-3 rounded-lg mb-2 bg-${player.color}/20 border-l-4 border-${player.color}`}
                      >
                        <span className="font-medium">
                          {player.name}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              
              <div className="bg-surface-100/50 dark:bg-surface-800/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-3">Score</h3>
                
                <div className="space-y-3">
                  {players.map(player => {
                    return (
                      <div 
                        key={player.id}
                        className={`flex justify-between items-center p-2 rounded-lg bg-${player.color}/10 dark:bg-${player.color}/20`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full bg-${player.color}`}></div>
                          <span>{player.name}</span>
                        </div>
                        <span className="text-xl font-bold">{player.score}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;