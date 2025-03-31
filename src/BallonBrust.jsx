import React, { useState, useEffect, useCallback } from 'react';
// Import all balloon images
import balloon1 from './Graphics/Symbol 100001.png';
import balloon2 from './Graphics/Symbol 100002.png';
import balloon3 from './Graphics/Symbol 100003.png';
import balloon4 from './Graphics/Symbol 100004.png';
import balloon5 from './Graphics/Symbol 100005.png';
// import balloon6 from './Graphics/Symbol 100006.png';
// import balloon7 from './Graphics/Symbol 100007.png';
// import balloon8 from './Graphics/Symbol 100008.png';
// import balloon9 from './Graphics/Symbol 100009.png';
// import balloon10 from './Graphics/Symbol 100010.png';
import backgroundImg from "./Graphics/Symbol 3 copy.png"
import BombImg from "./Graphics/Bomb-Img.png"
import GameIsOver from './GameIsOver';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUserScore } from './utils/userDataSlice';
import { addAlluser} from './utils/userSlice';
// import { addUserScore } from './utils/userDataSlice';

const BalloonBurstGame = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [tierStatusText, setTierStatusText] = useState('🌱 Beginner Blower');
  const [balloons, setBalloons] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const dispatch=useDispatch();
  const fullName=useSelector((store)=>store?.userData?.userName);
  const id=useSelector((store)=>store?.userData?.id);
  // Game configuration
  const tiers = [
    "🌱 Beginner Blower",
    "🚀 Balloon Master", 
    "✨ Air Wizard", 
    "☁️ Sky Champion", 
    "🔥 Balloon God"
  ];

  const balloonImages = [
    balloon1, 
    balloon2, 
    balloon3, 
    balloon4, 
    balloon5, 
  ];

  // Custom CSS for fly animation with moderate speed
  const flyAnimation = `
    @keyframes fly {
      0% { transform: translateX(var(--fly-start-x)) translateY(0); }
      100% { transform: translateX(var(--fly-end-x)) translateY(-100vh); }
    }
    .animate-fly {
      animation: fly 6s linear forwards; /* Adjusted from 5s to 6s - slightly slower but still faster than original 8s */
    }
  `;

  // Reset game function
  // const resetGame = useCallback(() => {
  //   setScore(0);
  //   setTierStatusText('🌱 Beginner Blower');
  //   setBalloons([]);
  //   setGameOver(false);
  // }, []);

  // Create a new balloon
  const createBalloon = useCallback(() => {
    // Determine if this balloon should be a bomb (10% chance)
    const isBomb = Math.random() < 0.1;
    const randomImage = isBomb ? BombImg : balloonImages[Math.floor(Math.random() * balloonImages.length)];
    
    return {
      id: Date.now() + Math.random(), // Ensure unique IDs even when creating multiple balloons at once
      src: randomImage,
      size: 100, // Increased initial size
      clicks: 0,
      isFlying: false,
      startX: `${Math.random() * 100}%`, // Random horizontal start position
      endX: `${Math.random() * 200 - 50}%`, // Random horizontal end position
      isBomb: isBomb
    };
  }, [balloonImages]);

  // Pop balloon
  const Nevigate=useNavigate();
  const popBalloon = (balloon) => {
    if (!balloon.isFlying) return;

    // Check if it's a bomb
    if (balloon.isBomb || balloon.src === BombImg) {
      dispatch(addUserScore(score));
      setGameOver(true);
 
      // Show game over message and restart after a delay
      setTimeout(() => {
        dispatch(addAlluser(
          {
            "id":id,
            "fullName":fullName,
            "Score":score
          }
        ))
        Nevigate("/");
      }, 4000);
      
      return;
    }

    // Remove balloon
    const updatedBalloons = balloons.filter(b => b.id !== balloon.id);
    setBalloons(updatedBalloons);

    // Update score
    const newScore = score + 10;
    setScore(newScore);

    // Determine tier
    let newTierStatus = '';
    if (newScore >= 0 && newScore <= 49) newTierStatus = tiers[0];
    else if (newScore >= 50 && newScore <= 99) newTierStatus = tiers[1];
    else if (newScore >= 100 && newScore <= 149) newTierStatus = tiers[2];
    else if (newScore >= 150 && newScore <= 299) newTierStatus = tiers[3];
    else if (newScore >= 300) newTierStatus = tiers[4];

    setTierStatusText(newTierStatus);
  };

  // Spawn balloons periodically
  useEffect(() => {
    if (gameOver) return; // Don't spawn balloons if game is over
    
    const spawnInterval = setInterval(() => {
      if (balloons.length < 120) { // Reduced from 200 to 120 for a more manageable number of balloons
        setBalloons(prev => {
          // Create 1-2 new balloons at once (reduced from 2-4)
          const numNewBalloons = Math.floor(Math.random() * 2) + 1;
          const newBalloons = [];
          
          for (let i = 0; i < numNewBalloons; i++) {
            const newBalloon = createBalloon();
            // Automatically set balloon to flying after creation
            newBalloon.isFlying = true;
            newBalloons.push(newBalloon);
          }
          
          return [...prev, ...newBalloons];
        });
      }
    }, 750); // Adjusted from 500ms to 750ms - a bit slower but still faster than the original 1000ms

    return () => clearInterval(spawnInterval);
  }, [balloons, createBalloon, gameOver]);

  // Auto-remove flying balloons
  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedBalloons = balloons.filter(b => b.y > -100);
      setBalloons(updatedBalloons);
    }, 6000); // Adjusted to match the animation duration

    return () => clearTimeout(timer);
  }, [balloons]);

  return (
    <>
      {/* Add custom animation styles */}
      <style>{flyAnimation}</style>

      <div 
        style={{ backgroundImage: `url(${backgroundImg})` }} 
        className="bg-cover bg-center fixed inset-0"
      >
        {/* Score and Tier Display */}
        <div className="absolute space-y-1 top-5 right-5 text-black z-10">
        <div className="text-2xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Weolcome, {fullName}
          </div>
          <div className="text-2xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            Score: {score}
          </div>
          <div className="text-2xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            {tierStatusText}
          </div>
        </div>

        {/* Balloon Container */}
        <div className="relative w-full h-full">
          {balloons.map(balloon => (
            <img 
              key={balloon.id}
              src={balloon.src}
              alt={balloon.isBomb ? "Bomb" : "Balloon"}
              onClick={() => popBalloon(balloon)}
              className={`absolute bottom-0 cursor-pointer 
                ${balloon.isFlying ? 'animate-fly' : ''}`}
              style={{
                width: `${balloon.size}px`,
                height: `${balloon.size}px`,
                left: balloon.startX,
                '--fly-start-x': balloon.startX,
                '--fly-end-x': balloon.endX
              }}
            />
          ))}
        </div>

        {/* Game Over Message */}
        {gameOver && (
          <GameIsOver score={score}/>
        )}

        {/* Instructions */}
        <div className="absolute bottom-10 right-[40%] text-center text-[rgb(45,15,18)] text-2xl font-bold z-10" 
             style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
          <p>Tap balloons to burst them 💥</p>
          <p className="text-red-600">Avoid the bombs! 💣</p>
        </div>
      </div>
    </>
  );
};

export default BalloonBurstGame;