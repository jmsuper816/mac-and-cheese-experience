import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Home, RotateCcw, Trophy, Clock, Target, Zap, Timer } from "lucide-react";
import { toast } from "sonner";
import { generatePattern, PatternPuzzle } from "@/lib/games/patternPizzaData";
import { useNavigate } from "react-router-dom";
import { useGameProgress } from "@/contexts/GameProgressContext";

interface PatternPizzaGameProps {
  tier: number;
  onBack: () => void;
}

interface RoundResult {
  correct: boolean;
  timeSpent: number;
  pointsEarned: number;
}

const TIMER_DURATION = 15;
const BASE_POINTS = 10;
const SPEED_BONUS_MULTIPLIER = 2;

export const PatternPizzaGame = ({ tier, onBack }: PatternPizzaGameProps) => {
  const navigate = useNavigate();
  const { addCompletion } = useGameProgress();
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [puzzle, setPuzzle] = useState<PatternPuzzle | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [gameComplete, setGameComplete] = useState(false);

  const totalRounds = 8;

  const loadNewPattern = useCallback(() => {
    const newPuzzle = generatePattern(tier);
    setPuzzle(newPuzzle);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(TIMER_DURATION);
  }, [tier]);

  const restartGame = useCallback(() => {
    setCurrentRound(1);
    setScore(0);
    setStreak(0);
    setRoundResults([]);
    setGameComplete(false);
    loadNewPattern();
  }, [loadNewPattern]);

  useEffect(() => {
    loadNewPattern();
  }, [loadNewPattern]);

  useEffect(() => {
    if (gameComplete || showFeedback) return;
    
    // Timer counts down but doesn't force an answer - just affects speed bonus
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    // No penalty when timer reaches 0 - player can still answer
  }, [timeLeft, gameComplete, showFeedback]);

  const handleTimeout = () => {
    const timeSpent = TIMER_DURATION;
    setStreak(0);
    setShowFeedback(true);
    
    const newResults = [...roundResults, { correct: false, timeSpent, pointsEarned: 0 }];
    setRoundResults(newResults);
    
    toast.error("Time's up! ⏰", {
      description: puzzle ? `The answer was: ${puzzle.correctAnswer}` : undefined,
    });
    
    setTimeout(() => {
      if (currentRound < totalRounds) {
        setCurrentRound(currentRound + 1);
        loadNewPattern();
      } else {
        handleGameComplete(score, newResults);
      }
    }, 800);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const calculatePoints = (timeRemaining: number, hasStreakBonus: boolean): number => {
    const speedBonus = timeRemaining * SPEED_BONUS_MULTIPLIER;
    const streakBonus = hasStreakBonus ? 10 : 0;
    return BASE_POINTS + speedBonus + streakBonus;
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !puzzle) return;

    const timeSpent = TIMER_DURATION - timeLeft;
    const isCorrect = selectedAnswer === puzzle.correctAnswer;
    setShowFeedback(true);

    if (isCorrect) {
      const newStreak = streak + 1;
      const hasStreakBonus = newStreak >= 3;
      const points = calculatePoints(timeLeft, hasStreakBonus);
      
      const newResults = [...roundResults, { correct: true, timeSpent, pointsEarned: points }];
      setRoundResults(newResults);
      setScore(score + points);
      setStreak(newStreak);
      
      const speedMessage = timeLeft > 10 ? "⚡ Lightning fast!" : timeLeft > 5 ? "🚀 Quick!" : "";
      
      if (hasStreakBonus) {
        toast.success(`Perfect! +${points} points! 🔥 ${newStreak} streak! ${speedMessage}`, {
          description: "You're on fire!",
        });
      } else {
        toast.success(`Correct! +${points} points! 🎉 ${speedMessage}`);
      }

      setTimeout(() => {
        if (currentRound < totalRounds) {
          setCurrentRound(currentRound + 1);
          loadNewPattern();
        } else {
          handleGameComplete(score + points, newResults);
        }
      }, 600);
    } else {
      const newResults = [...roundResults, { correct: false, timeSpent, pointsEarned: 0 }];
      setRoundResults(newResults);
      setStreak(0);
      
      toast.error("Not quite! Try the next one! 💪", {
        description: `The answer was: ${puzzle.correctAnswer}`,
      });
      
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setCurrentRound(currentRound + 1);
          loadNewPattern();
        } else {
          handleGameComplete(score, newResults);
        }
      }, 800);
    }
  };

  const handleGameComplete = (finalScore: number, results: RoundResult[]) => {
    setGameComplete(true);
    
    const maxScore = totalRounds * (BASE_POINTS + TIMER_DURATION * SPEED_BONUS_MULTIPLIER + 10);
    const percentage = Math.min(100, (finalScore / maxScore) * 100);
    
    addCompletion({
      gameId: "pattern-pizza",
      tier,
      score: finalScore,
      maxScore,
      percentage,
    });
  };

  const totalTime = roundResults.reduce((sum, r) => sum + r.timeSpent, 0);
  const correctCount = roundResults.filter(r => r.correct).length;
  const avgTime = roundResults.length > 0 ? (totalTime / roundResults.length).toFixed(1) : 0;
  const correctResults = roundResults.filter(r => r.correct);
  const fastestTime = correctResults.length > 0 
    ? Math.min(...correctResults.map(r => r.timeSpent)) 
    : 0;

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-card border-4 border-border rounded-2xl p-8 shadow-lg animate-pop-in text-center">
            <div className="text-6xl mb-4">🍕</div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">Game Complete!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-primary/10 rounded-xl p-4">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              
              <div className="bg-success/10 rounded-xl p-4">
                <Target className="h-8 w-8 mx-auto mb-2 text-success" />
                <div className="text-3xl font-bold text-success">{correctCount}/{totalRounds}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              
              <div className="bg-accent/20 rounded-xl p-4">
                <Zap className="h-8 w-8 mx-auto mb-2 text-accent" />
                <div className="text-3xl font-bold text-accent">{fastestTime}s</div>
                <div className="text-sm text-muted-foreground">Fastest Pattern</div>
              </div>
              
              <div className="bg-destructive/15 rounded-xl p-4">
                <Clock className="h-8 w-8 mx-auto mb-2 text-destructive" />
                <div className="text-3xl font-bold text-destructive">{avgTime}s</div>
                <div className="text-sm text-muted-foreground">Avg per Question</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button variant="game" size="lg" onClick={restartGame} className="gap-2 w-full">
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
        </div>
      </div>
    );
  }

  if (!puzzle) return null;
  const timerPercentage = (timeLeft / TIMER_DURATION) * 100;
  const timerColor = timeLeft > 10 ? "text-success" : timeLeft > 5 ? "text-warning" : "text-destructive";
  const timerBarColor = timeLeft > 10 ? "bg-success" : timeLeft > 5 ? "bg-warning" : "bg-destructive";

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

        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-foreground">
              Round {currentRound}/{totalRounds}
            </div>
            <div className="text-2xl font-bold text-primary">
              Score: {score}
            </div>
          </div>
          
          <Progress value={(currentRound / totalRounds) * 100} className="h-3" />
          
          {/* Speed Bonus Timer */}
          <div className="mt-4 flex items-center gap-3">
            <Timer className={`h-5 w-5 ${timerColor}`} />
            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${timerBarColor}`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
            <span className={`font-bold text-lg min-w-[2rem] text-right ${timerColor}`}>
              {timeLeft}s
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Speed bonus: +{timeLeft} points!
          </p>
          
          {streak >= 3 && (
            <div className="text-center text-lg font-bold text-primary animate-pulse">
              🔥 {streak} Streak! +10 Bonus Points! 🔥
            </div>
          )}
        </div>

        <Card className="border-4 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                What comes next in the pattern?
              </h2>
              
              <div className="flex items-center justify-center gap-3 text-6xl mb-6 flex-wrap">
                {puzzle.pattern.map((topping, index) => (
                  <span key={index}>{topping}</span>
                ))}
                <span className="text-primary">?</span>
              </div>

              {puzzle.hint && (
                <p className="text-muted-foreground text-lg mb-6">
                  💡 Hint: {puzzle.hint}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {puzzle.options.map((option, index) => {
                const isCorrect = option === puzzle.correctAnswer;
                const isSelected = selectedAnswer === option;
                
                let buttonClass = "h-24 text-5xl";
                let variant: "default" | "outline" | "destructive" = "outline";
                
                if (showFeedback) {
                  if (isCorrect) {
                    buttonClass += " bg-green-500 hover:bg-green-500 text-white border-green-500";
                  } else if (isSelected) {
                    buttonClass += " bg-red-500 hover:bg-red-500 text-white border-red-500";
                  }
                } else if (isSelected) {
                  variant = "default";
                }
                
                return (
                  <Button
                    key={index}
                    variant={variant}
                    size="lg"
                    className={buttonClass}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>

            {selectedAnswer && !showFeedback && (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full max-w-md mx-auto mt-6 block"
              >
                Submit Answer
              </Button>
            )}
          </CardContent>
        </Card>

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
