import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowLeft, Home, RotateCcw, CheckCircle, XCircle, Trophy, Timer } from "lucide-react";
import { generateSortingPuzzle, SortingPuzzle } from "@/lib/games/sortNSnackData";
import { useNavigate } from "react-router-dom";
import { useGameProgress } from "@/contexts/GameProgressContext";

const healthyLifestyleFacts = [
  "Drinking water helps your brain work better and keeps you energized!",
  "Getting 8-10 hours of sleep helps your body grow strong and healthy!",
  "Playing outside for 60 minutes a day keeps your heart happy!",
  "Eating breakfast gives you energy to learn and play all day!",
  "Washing your hands keeps germs away and helps you stay healthy!",
  "Laughing and playing with friends is great for your health!",
  "Stretching your body helps you stay flexible and feel good!",
  "Taking deep breaths can help you feel calm and relaxed!",
  "Eating colorful fruits and vegetables gives your body superpowers!",
  "Dancing and moving your body makes your muscles strong!",
];

interface SortNSnackGameProps {
  tier: number;
  onBack: () => void;
}

const SPEED_BONUS_TIME = 10; // seconds to get speed bonus

export const SortNSnackGame = ({ tier, onBack }: SortNSnackGameProps) => {
  const navigate = useNavigate();
  const { addCompletion } = useGameProgress();
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [puzzle, setPuzzle] = useState<SortingPuzzle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [usedFoods, setUsedFoods] = useState<string[]>([]);
  const [showFactDialog, setShowFactDialog] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SPEED_BONUS_TIME);
  const [gotSpeedBonus, setGotSpeedBonus] = useState(false);

  const totalRounds = 10;

  useEffect(() => {
    loadNewPuzzle();
  }, [tier]);

  // Speed bonus timer
  useEffect(() => {
    if (showFeedback || showFactDialog || showSummary) return;
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showFeedback, showFactDialog, showSummary]);

  const loadNewPuzzle = () => {
    const newPuzzle = generateSortingPuzzle(tier, usedFoods);
    setPuzzle(newPuzzle);
    setUsedFoods([...usedFoods, newPuzzle.food]);
    setSelectedCategory(null);
    setShowFeedback(false);
    setTimeLeft(SPEED_BONUS_TIME);
    setGotSpeedBonus(false);
  };

  const handleCategorySelect = (category: string) => {
    if (showFeedback) return;
    setSelectedCategory(category);
  };

  const handleSubmit = () => {
    if (!selectedCategory || !puzzle) return;

    const isCorrect = selectedCategory === puzzle.correctCategory;
    setShowFeedback(true);
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      const newStreak = streak + 1;
      const streakBonus = newStreak >= 3 ? 5 : 0;
      const speedBonus = timeLeft > 0 ? 5 : 0;
      const points = 10 + streakBonus + speedBonus;
      
      setScore(score + points);
      setStreak(newStreak);
      setPointsEarned(points);
      setCorrectAnswers(correctAnswers + 1);
      setGotSpeedBonus(speedBonus > 0);
    } else {
      setStreak(0);
      setPointsEarned(0);
      setGotSpeedBonus(false);
    }

    // Show fact dialog after a brief delay to show the color feedback
    setTimeout(() => {
      setShowFactDialog(true);
    }, 500);
  };

  const handleNextQuestion = () => {
    setShowFactDialog(false);
    
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
      loadNewPuzzle();
    } else {
      setShowSummary(true);
    }
  };

  const handleFinishGame = () => {
    setShowSummary(false);
    handleGameEnd();
  };

  const handleGameEnd = () => {
    const maxScore = totalRounds * 15; // Max 15 points per round with streak bonus
    const percentage = Math.min(100, (score / maxScore) * 100);
    
    addCompletion({
      gameId: "sort-n-snack",
      tier,
      score,
      maxScore,
      percentage,
    });
    
    onBack();
  };

  if (!puzzle) return null;

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
            <Timer className={`h-5 w-5 ${timeLeft > 5 ? 'text-success' : timeLeft > 0 ? 'text-warning' : 'text-muted-foreground'}`} />
            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${timeLeft > 5 ? 'bg-success' : timeLeft > 0 ? 'bg-warning' : 'bg-muted-foreground'}`}
                style={{ width: `${(timeLeft / SPEED_BONUS_TIME) * 100}%` }}
              />
            </div>
            <span className={`font-bold text-lg min-w-[2rem] text-right ${timeLeft > 5 ? 'text-success' : timeLeft > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
              {timeLeft}s
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {timeLeft > 0 ? `Speed bonus: +5 points!` : 'No speed bonus'}
          </p>
          
          {streak >= 3 && (
            <div className="text-center text-lg font-bold text-primary animate-pulse">
              🔥 {streak} Streak! +5 Bonus Points! 🔥
            </div>
          )}
        </div>

        <Card className="border-4 shadow-xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">
                Where does this food belong?
              </h2>
              
              <div className="text-8xl mb-4">
                {puzzle.emoji}
              </div>
              
              <p className="text-3xl font-bold text-foreground mb-6">
                {puzzle.food}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {puzzle.categories.map((category, index) => {
                const isCorrect = category === puzzle.correctCategory;
                const isSelected = selectedCategory === category;
                
                let buttonClass = "h-20 text-xl";
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
                    onClick={() => handleCategorySelect(category)}
                    disabled={showFeedback}
                  >
                    {category}
                  </Button>
                );
              })}
            </div>

            {selectedCategory && !showFeedback && (
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

        {/* Fact Dialog */}
        <Dialog open={showFactDialog} onOpenChange={setShowFactDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center flex flex-col items-center justify-center gap-2">
                {lastAnswerCorrect ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <span>Correct! +{pointsEarned} points!</span>
                    </div>
                    {gotSpeedBonus && (
                      <div className="text-sm text-primary flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        Speed Bonus!
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-red-500" />
                    Not quite!
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
              {puzzle && (
                  <div className="space-y-3">
                    <div className="text-4xl">{puzzle.emoji}</div>
                    <p className="text-lg text-foreground">
                      {puzzle.explanation}
                    </p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <Button 
              onClick={handleNextQuestion} 
              size="lg" 
              className="w-full mt-4"
            >
              {currentRound < totalRounds ? "Next Question" : "See Results"}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Summary Dialog */}
        <Dialog open={showSummary} onOpenChange={setShowSummary}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Game Complete!
              </DialogTitle>
              <DialogDescription className="text-center pt-4">
                <div className="space-y-4">
                  <div className="text-6xl">
                    {correctAnswers >= 8 ? "🌟" : correctAnswers >= 5 ? "👍" : "💪"}
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {correctAnswers} out of {totalRounds} correct!
                  </p>
                  <p className="text-xl font-semibold text-primary">
                    Final Score: {score} points
                  </p>
                  <div className="bg-primary/10 rounded-lg p-4 mt-4">
                    <p className="text-sm font-medium text-primary mb-1">🌱 Healthy Start Tip:</p>
                    <p className="text-base text-foreground">
                      {healthyLifestyleFacts[Math.floor(Math.random() * healthyLifestyleFacts.length)]}
                    </p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              <Button 
                variant="outline"
                onClick={handleFinishGame} 
                size="lg" 
                className="flex-1"
              >
                Back to Levels
              </Button>
              <Button 
                onClick={() => {
                  setShowSummary(false);
                  setCurrentRound(1);
                  setScore(0);
                  setStreak(0);
                  setCorrectAnswers(0);
                  setUsedFoods([]);
                  loadNewPuzzle();
                }} 
                size="lg" 
                className="flex-1"
              >
                Play Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
