import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Home, RotateCcw, Pause, Play, Trophy, Target, Apple, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { FallingFood, generateFoods, checkCollision } from "@/lib/games/snackAttackData";
import { useNavigate } from "react-router-dom";
import { useGameProgress } from "@/contexts/GameProgressContext";
import macCheeseDefault from "@/assets/characters/mac-cheese-default.webp";
import macCheeseAvocado from "@/assets/characters/mac-cheese-avocado.webp";
import macCheeseBurger from "@/assets/characters/mac-cheese-burger.webp";
import macCheeseHotdog from "@/assets/characters/mac-cheese-hotdog.webp";
import macCheeseSushi from "@/assets/characters/mac-cheese-sushi.webp";
import macCheeseTaco from "@/assets/characters/mac-cheese-taco.webp";
import macCheeseCookies from "@/assets/characters/mac-cheese-cookies.webp";
import macCheeseEggs from "@/assets/characters/mac-cheese-eggs.webp";
import macCheesePbj from "@/assets/characters/mac-cheese-pbj.webp";
import macCheeseSpaghetti from "@/assets/characters/mac-cheese-spaghetti.webp";

interface SnackAttackGameProps {
  tier: number;
  onBack: () => void;
}

export const SnackAttackGame = ({ tier, onBack }: SnackAttackGameProps) => {
  const navigate = useNavigate();
  const { selectedOutfit, addCompletion } = useGameProgress();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameActive, setGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [foods, setFoods] = useState<FallingFood[]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [goodCaught, setGoodCaught] = useState(0);
  const [goodSpawned, setGoodSpawned] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [unlockedSticker, setUnlockedSticker] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const playerPositionRef = useRef(50);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Point thresholds for stickers based on tier
  const pointThresholds: Record<number, number> = {
    1: 100, // Snack Starter
    2: 100, // Food Fighter
    3: 100, // Reflex Master
  };

  const outfitImages: Record<string, string> = {
    default: macCheeseDefault,
    burger: macCheeseBurger,
    taco: macCheeseTaco,
    hotdog: macCheeseHotdog,
    sushi: macCheeseSushi,
    avocado: macCheeseAvocado,
    cookies: macCheeseCookies,
    eggs: macCheeseEggs,
    pbj: macCheesePbj,
    spaghetti: macCheeseSpaghetti,
  };

  const currentImage = outfitImages[selectedOutfit] || macCheeseDefault;

  const spawnRate = tier === 1 ? 2000 : tier === 2 ? 1500 : 1000;
  const fallSpeed = tier === 1 ? 0.08 : tier === 2 ? 0.12 : 0.16;
  const targetScore = pointThresholds[tier] || 150;

  const handleGameEnd = useCallback((finalScoreVal: number) => {
    if (gameEnded) return;
    setGameEnded(true);
    setGameActive(false);
    setFinalScore(finalScoreVal);

    const percentage = Math.min(100, (finalScoreVal / targetScore) * 100);
    const earnedSticker = finalScoreVal >= targetScore;
    setUnlockedSticker(earnedSticker);

    addCompletion({
      gameId: "snack-attack",
      tier,
      score: finalScoreVal,
      maxScore: targetScore,
      percentage,
    });

    if (earnedSticker) {
      toast.success(`You unlocked the sticker! 🌟`, { duration: 4000 });
    }
  }, [gameEnded, tier, targetScore, addCompletion]);

  // Check if lives are depleted (game ends when out of lives)
  useEffect(() => {
    if (lives <= 0 && gameActive && !gameEnded) {
      handleGameEnd(score);
    }
  }, [lives, gameActive, gameEnded, score, handleGameEnd]);

  // Spawn foods
  useEffect(() => {
    if (!gameActive || gameEnded || isPaused) return;

    const spawnInterval = setInterval(() => {
      const newFoods = generateFoods(tier, 1);
      const goodSpawned = newFoods.filter((f) => f.isGood).length;
      if (goodSpawned > 0) setGoodSpawned((p) => p + goodSpawned);
      setFoods((prev) => [...prev, ...newFoods]);
    }, spawnRate);

    return () => clearInterval(spawnInterval);
  }, [gameActive, gameEnded, isPaused, tier, spawnRate]);

  // Main game loop using requestAnimationFrame
  useEffect(() => {
    if (!gameActive || gameEnded || isPaused) return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setFoods((prevFoods) => {
        const updatedFoods: FallingFood[] = [];
        let scoreChange = 0;
        let livesChange = 0;

        for (const food of prevFoods) {
          const newY = food.y + fallSpeed * deltaTime;
          
          // Remove foods that fell off screen
          if (newY >= 100) continue;

          // Check collision
          if (
            !food.hit &&
            newY > 70 &&
            newY < 85 &&
            checkCollision({ ...food, y: newY }, playerPositionRef.current)
          ) {
            if (food.isGood) {
              scoreChange += 10;
              setGoodCaught((p) => p + 1);
            } else {
              livesChange -= 1;
            }
            updatedFoods.push({ ...food, y: newY, hit: true });
          } else {
            updatedFoods.push({ ...food, y: newY });
          }
        }

        // Batch state updates
        if (scoreChange > 0) {
          setScore((prev) => prev + scoreChange);
        }
        if (livesChange < 0) {
          setLives((prev) => prev + livesChange);
        }

        return updatedFoods;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [gameActive, gameEnded, isPaused, fallSpeed]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setFoods([]);
    setGameEnded(false);
    setGameActive(true);
    setIsPaused(false);
    setGoodCaught(0);
    setGoodSpawned(0);
    setFinalScore(0);
    setUnlockedSticker(false);
    lastTimeRef.current = 0;
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    lastTimeRef.current = 0;
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const newPos = Math.max(0, Math.min(100, x));
    playerPositionRef.current = newPos;
    setPlayerPosition(newPos);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    const newPos = Math.max(0, Math.min(100, x));
    playerPositionRef.current = newPos;
    setPlayerPosition(newPos);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Levels
        </Button>

        {gameEnded ? (
          <Card className="border-4 shadow-xl p-8 animate-pop-in">
            <div className="text-center">
              <div className="text-6xl mb-4">{unlockedSticker ? "🌟" : "🎮"}</div>
              <h2 className="text-4xl font-bold mb-2 text-foreground">
                {unlockedSticker ? "Awesome Job!" : "Game Over!"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {unlockedSticker
                  ? "You unlocked a sticker!"
                  : `You needed ${targetScore} points for the sticker. Keep trying!`}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
                <div className="bg-primary/10 rounded-xl p-4">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-3xl font-bold text-primary">{finalScore}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
                <div className="bg-success/10 rounded-xl p-4">
                  <Target className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="text-3xl font-bold text-success">{targetScore}</div>
                  <div className="text-sm text-muted-foreground">Sticker Goal</div>
                </div>
                <div className="bg-accent/20 rounded-xl p-4">
                  <Apple className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-3xl font-bold text-accent">{goodCaught}/{goodSpawned}</div>
                  <div className="text-sm text-muted-foreground">Good Foods Caught</div>
                </div>
                <div className="bg-success/10 rounded-xl p-4">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
                  <div className="text-3xl font-bold text-success">
                    {goodSpawned > 0 ? Math.round((goodCaught / goodSpawned) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Catch Rate</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-md mx-auto">
                <Button variant="game" size="lg" onClick={startGame} className="gap-2 w-full">
                  <RotateCcw className="h-5 w-5" />
                  Play Again
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={onBack} className="gap-2 flex-1">
                    <Target className="h-5 w-5" />
                    Change Difficulty
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate("/")} className="gap-2 flex-1">
                    <Home className="h-5 w-5" />
                    Home
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : !gameActive ? (
          <Card className="border-4 shadow-xl p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Ready to Play?
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Move left and right to catch good foods (🍎🥕🍇) and dodge bad ones (🍕🍩🍔)!
              </p>
              <Button onClick={startGame} size="lg" className="text-2xl h-16 px-8">
                Start Game!
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-foreground">
                  Score: {score}
                </div>
                <div className="text-2xl font-bold text-destructive">
                  Lives: {"❤️".repeat(Math.max(0, lives))}
                </div>
              </div>
            </div>

            <div
              ref={gameAreaRef}
              className="relative bg-gradient-to-b from-sky-200 to-sky-100 border-4 border-border rounded-2xl overflow-hidden cursor-none touch-none"
              style={{ height: "500px" }}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* Pause Button */}
              <Button
                variant="secondary"
                size="icon"
                onClick={togglePause}
                className="absolute top-3 right-3 z-20 bg-yellow-400 hover:bg-yellow-500 text-white h-12 w-12"
              >
                {isPaused ? <Play className="h-8 w-8" fill="currentColor" /> : <Pause className="h-8 w-8" fill="currentColor" />}
              </Button>
              {/* Falling Foods */}
              {foods.map((food) => (
                <div
                  key={food.id}
                  className={`absolute ${food.hit ? "opacity-0" : "opacity-100"}`}
                  style={{
                    left: `${food.x}%`,
                    top: `${food.y}%`,
                    transform: "translate(-50%, -50%)",
                    willChange: "top",
                    fontSize: "4rem",
                  }}
                >
                  {food.emoji}
                </div>
              ))}

              {/* Player */}
              <div
                className="absolute bottom-2 w-32"
                style={{
                  left: `clamp(0px, calc(${playerPosition}% - 64px), calc(100% - 128px))`,
                  willChange: "left",
                }}
              >
                <img 
                  src={currentImage} 
                  alt="Mac and Cheese" 
                  className="h-32 w-32 object-contain drop-shadow-lg"
                />
              </div>

              {/* Ground line */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-600" />

              {/* Pause Overlay */}
              {isPaused && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <div className="text-center">
                    <h3 className="text-4xl font-bold text-foreground mb-4">Paused</h3>
                    <Button onClick={togglePause} size="lg" className="gap-2">
                      <Play className="h-5 w-5" />
                      Resume Game
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Controls */}
        <div className="flex gap-4 justify-center mt-6">
          <Button variant="outline" size="lg" onClick={() => navigate("/")} className="gap-2">
            <Home className="h-5 w-5" />
            Home
          </Button>
          <Button variant="outline" size="lg" onClick={onBack} className="gap-2">
            <RotateCcw className="h-5 w-5" />
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
};
