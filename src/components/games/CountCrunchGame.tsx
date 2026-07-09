import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { DifficultyTier } from "@/pages/CountCrunch";
import { generateQuestion, Question } from "@/lib/games/countCrunchData";
import { Home, RotateCcw, Trophy, Clock, Target, Zap, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGameProgress } from "@/contexts/GameProgressContext";

interface CountCrunchGameProps {
  tier: DifficultyTier;
  onGameEnd: () => void;
}

interface RoundResult {
  correct: boolean;
  timeSpent: number;
  pointsEarned: number;
}

const TIMER_DURATION = 15;
const BASE_POINTS = 10;
const SPEED_BONUS_MULTIPLIER = 2; // Points per second remaining

export const CountCrunchGame = ({ tier, onGameEnd }: CountCrunchGameProps) => {
  const navigate = useNavigate();
  const { addCompletion } = useGameProgress();
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const maxRounds = 10;

  const restartGame = useCallback(() => {
    setScore(0);
    setRound(1);
    setStreak(0);
    setTimeLeft(TIMER_DURATION);
    setRoundResults([]);
    setGameComplete(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuestion(generateQuestion(tier));
  }, [tier]);

  const loadNextQuestion = useCallback(() => {
    const newQuestion = generateQuestion(tier);
    setQuestion(newQuestion);
    setTimeLeft(TIMER_DURATION);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [tier]);

  useEffect(() => {
    loadNextQuestion();
  }, [loadNextQuestion]);

  useEffect(() => {
    if (gameComplete || showFeedback) return;
    
    // Timer counts down but doesn't force an answer - just affects speed bonus
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    // No penalty when timer reaches 0 - player can still answer
  }, [timeLeft, gameComplete, showFeedback]);

  const calculatePoints = (timeRemaining: number): number => {
    const tierBonus = tier * 5;
    const speedBonus = timeRemaining * SPEED_BONUS_MULTIPLIER;
    const streakBonus = streak * 2;
    return BASE_POINTS + tierBonus + speedBonus + streakBonus;
  };

  const handleAnswerSelect = (answer: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !question || gameComplete) return;

    const timeSpent = TIMER_DURATION - timeLeft;
    const isCorrect = selectedAnswer === question.correctAnswer;
    setShowFeedback(true);

    if (isCorrect) {
      const points = calculatePoints(timeLeft);
      setScore(score + points);
      setStreak(streak + 1);
      
      setRoundResults([...roundResults, { correct: true, timeSpent, pointsEarned: points }]);
      
      const speedMessage = timeLeft > 10 ? "⚡ Lightning fast!" : timeLeft > 5 ? "🚀 Quick!" : "";
      toast.success(`Nom nom! Correct! 🎉 ${speedMessage}`, {
        description: streak > 2 ? `${streak + 1} in a row! +${points} points!` : `+${points} points!`,
      });

      setTimeout(() => {
        if (round >= maxRounds) {
          handleGameComplete(score + points, [...roundResults, { correct: true, timeSpent, pointsEarned: points }]);
        } else {
          setRound(round + 1);
          loadNextQuestion();
        }
      }, 600);
    } else {
      setStreak(0);
      setRoundResults([...roundResults, { correct: false, timeSpent, pointsEarned: 0 }]);
      
      toast.error("Oops! Try again!", {
        description: `The answer was: ${question.correctAnswer}`,
      });
      
      setTimeout(() => {
        if (round >= maxRounds) {
          handleGameComplete(score, [...roundResults, { correct: false, timeSpent, pointsEarned: 0 }]);
        } else {
          setRound(round + 1);
          loadNextQuestion();
        }
      }, 800);
    }
  };

  const handleWrongAnswer = () => {
    const timeSpent = TIMER_DURATION - timeLeft;
    setStreak(0);
    setShowFeedback(true);
    setRoundResults([...roundResults, { correct: false, timeSpent, pointsEarned: 0 }]);
    
    toast.error("Time's up! ⏰", {
      description: question ? `The answer was: ${question.correctAnswer}` : undefined,
    });
    
    setTimeout(() => {
      if (round >= maxRounds) {
        handleGameComplete(score, [...roundResults, { correct: false, timeSpent, pointsEarned: 0 }]);
      } else {
        setRound(round + 1);
        loadNextQuestion();
      }
    }, 800);
  };

  const handleGameComplete = (finalScore: number, results: RoundResult[]) => {
    setGameComplete(true);
    
    const correctCount = results.filter(r => r.correct).length;
    const maxScore = maxRounds * (BASE_POINTS + tier * 5 + TIMER_DURATION * SPEED_BONUS_MULTIPLIER + 10);
    const percentage = Math.min(100, (finalScore / maxScore) * 100);
    
    addCompletion({
      gameId: "count-crunch",
      tier,
      score: finalScore,
      maxScore,
      percentage,
    });
  };

  const totalTime = roundResults.reduce((sum, r) => sum + r.timeSpent, 0);
  const correctCount = roundResults.filter(r => r.correct).length;
  const avgTime = roundResults.length > 0 ? (totalTime / roundResults.length).toFixed(1) : 0;

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-card border-4 border-border rounded-2xl p-8 shadow-lg animate-pop-in text-center">
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-4xl font-bold mb-6 text-foreground">Game Complete!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-primary/10 rounded-xl p-4">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              
              <div className="bg-success/10 rounded-xl p-4">
                <Target className="h-8 w-8 mx-auto mb-2 text-success" />
                <div className="text-3xl font-bold text-success">{correctCount}/{maxRounds}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              
              <div className="bg-accent/20 rounded-xl p-4">
                <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
                <div className="text-3xl font-bold text-accent">{totalTime}s</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
              
              <div className="bg-destructive/15 rounded-xl p-4">
                <Zap className="h-8 w-8 mx-auto mb-2 text-destructive" />
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
                <Button variant="outline" size="lg" onClick={onGameEnd} className="gap-2 flex-1">
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

  if (!question) return null;

  const progress = (round / maxRounds) * 100;
  const timerPercentage = (timeLeft / TIMER_DURATION) * 100;
  const timerColor = timeLeft > 10 ? "text-success" : timeLeft > 5 ? "text-warning" : "text-destructive";
  const timerBarColor = timeLeft > 10 ? "bg-success" : timeLeft > 5 ? "bg-warning" : "bg-destructive";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-2xl w-full">
        {/* Combined Header - compact on mobile */}
        <div className="bg-card border-4 border-border rounded-2xl p-3 sm:p-6 mb-3 sm:mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="text-sm sm:text-lg font-bold">
              Round {round}/{maxRounds}
            </div>
            <div className="text-lg sm:text-2xl font-bold text-primary">
              ⭐ {score}
            </div>
            {streak > 1 && (
              <div className="text-sm sm:text-lg font-bold text-success animate-pulse">
                🔥 {streak}x
              </div>
            )}
          </div>
          <Progress value={progress} className="h-2 sm:h-3" />
          
          {/* Speed Bonus Timer - inline on mobile */}
          <div className="mt-2 sm:mt-4 flex items-center gap-2 sm:gap-3">
            <Timer className={`h-4 w-4 sm:h-5 sm:w-5 ${timerColor}`} />
            <div className="flex-1 bg-muted rounded-full h-3 sm:h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${timerBarColor}`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
            <span className={`font-bold text-sm sm:text-lg min-w-[2rem] text-right ${timerColor}`}>
              +{timeLeft}
            </span>
          </div>
        </div>

        {/* Question - compact on mobile */}
        <div className="bg-card border-4 border-border rounded-2xl p-4 sm:p-8 mb-3 sm:mb-6 shadow-lg animate-pop-in">
          <div className="text-center mb-4 sm:mb-8">
            {question.questionText && (
              <h2 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 text-foreground">
                {question.questionText}
              </h2>
            )}
            {question.type === "add" && question.num1 && question.num2 && (
              <p className="text-xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-4">
                {question.num1} + {question.num2} = <span className="inline-block w-8 sm:w-12 border-b-4 border-foreground"></span>
              </p>
            )}
            <div className="text-3xl sm:text-5xl mb-2 sm:mb-4 flex flex-wrap items-center justify-center gap-1 sm:gap-2 max-h-[5rem] sm:max-h-none overflow-hidden leading-snug">
              {question.type === "count" && (
                <span className="leading-tight">{question.emoji.repeat(question.correctAnswer)}</span>
              )}
              {question.type === "add" && question.num1 && question.num2 && question.emoji2 && (
                <>
                  <span className="leading-tight">{question.emoji.repeat(question.num1)}</span>
                  <span className="text-xl sm:text-3xl font-bold text-primary mx-1 sm:mx-2">+</span>
                  <span className="leading-tight">{question.emoji2.repeat(question.num2)}</span>
                </>
              )}
              {question.type === "missing" && (
                <span className="leading-tight">{question.emoji}</span>
              )}
            </div>
          </div>

          {/* Answer Options - smaller on mobile */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {question.options.map((option, index) => {
              const isCorrect = option === question.correctAnswer;
              const isSelected = selectedAnswer === option;
              
              let buttonClass = "text-2xl sm:text-3xl h-14 sm:h-20";
              let variant: "game" | "outline" = "outline";
              
              if (showFeedback) {
                if (isCorrect) {
                  buttonClass += " bg-green-500 hover:bg-green-500 text-white border-green-500";
                } else if (isSelected) {
                  buttonClass += " bg-red-500 hover:bg-red-500 text-white border-red-500";
                }
              } else if (isSelected) {
                variant = "game";
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

          {/* Submit button integrated into answer section */}
          {selectedAnswer !== null && !showFeedback && (
            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full max-w-md mx-auto mt-6 block"
            >
              Submit Answer
            </Button>
          )}
        </div>

        {/* Controls - smaller on mobile */}
        <div className="flex gap-2 sm:gap-4 justify-center">
          <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-1 sm:gap-2 text-xs sm:text-base h-9 sm:h-11">
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            Home
          </Button>
          <Button variant="outline" size="sm" onClick={onGameEnd} className="gap-1 sm:gap-2 text-xs sm:text-base h-9 sm:h-11">
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
};
