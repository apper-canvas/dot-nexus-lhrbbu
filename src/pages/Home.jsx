import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [gridSize, setGridSize] = useState(4);
  const [isHost, setIsHost] = useState(true);
  const [gameId, setGameId] = useState('');
  
  const GitHubIcon = getIcon('Github');
  const DotsSquareIcon = getIcon('DotSquare');
  const ShareIcon = getIcon('Share2');
  
  const handleStartGame = () => {
    if (isHost) {
      if (!username.trim()) {
        toast.error("Please enter a username");
        return;
      }
      
      const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
      toast.success(`Game created! ID: ${newGameId}`);
      // In a real app, we would create a game session on the server
    } else {
      if (!username.trim() || !gameId.trim()) {
        toast.error("Please enter your username and a valid game ID");
        return;
      }
      
      // In a real app, we would validate the game ID exists on the server
      toast.info(`Joining game ${gameId}...`);
    }
  };
  
  const copyGameLink = () => {
    // This would copy a join link to clipboard in a real implementation
    toast.success("Game link copied to clipboard!");
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3">
            <DotsSquareIcon className="w-12 h-12 md:w-16 md:h-16 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-surface-100 mb-4">
            Welcome to DotNexus
          </h1>
          <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
            The classic connect-the-dots game reimagined for online multiplayer. Draw lines, complete boxes, and outscore your opponent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="card hover:shadow-lg bg-gradient-to-br from-primary-light/10 to-primary/5 dark:from-primary/20 dark:to-primary-dark/10"
          >
            <h3 className="text-xl font-semibold mb-4 text-primary-dark dark:text-primary-light">How to Play</h3>
            <ul className="space-y-2 mb-4 list-disc pl-5 text-surface-700 dark:text-surface-300">
              <li>Players take turns drawing lines between adjacent dots</li>
              <li>When a player completes the 4th side of a box, they claim it and get another turn</li>
              <li>The player with the most boxes when the grid is filled wins</li>
              <li>Host a game and invite a friend, or join someone else's game</li>
            </ul>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="card hover:shadow-lg bg-gradient-to-br from-secondary-light/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary-dark/10"
          >
            <h3 className="text-xl font-semibold mb-4 text-secondary-dark dark:text-secondary-light">Game Stats</h3>
            <div className="space-y-3 text-surface-700 dark:text-surface-300">
              <div className="flex justify-between items-center">
                <span>Active Games:</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Players Online:</span>
                <span className="font-semibold">512</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Games Completed:</span>
                <span className="font-semibold">12,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Record Grid Size:</span>
                <span className="font-semibold">12×12</span>
              </div>
            </div>
          </motion.div>
        </div>

        <MainFeature />

        <div className="mt-10 flex justify-center items-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center space-x-2 text-surface-600 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
          >
            <GitHubIcon size={20} />
            <span>GitHub</span>
          </a>
          <button 
            onClick={copyGameLink}
            className="flex items-center space-x-2 text-surface-600 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
          >
            <ShareIcon size={20} />
            <span>Share</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;