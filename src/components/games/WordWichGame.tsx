import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DifficultyTier } from "@/pages/WordWich";
import { generateWordPuzzle, WordPuzzle } from "@/lib/games/wordWichData";
import { Home, RotateCcw, Timer, Trophy, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGameProgress } from "@/contexts/GameProgressContext";

interface WordWichGameProps {
  tier: DifficultyTier;
  onGameEnd: () => void;
  onPlayAgain?: () => void;
}

interface FastestWord {
  word: string;
  timeRemaining: number;
}

const TIMER_DURATION = 15; // 15 seconds per round

export const WordWichGame = ({ tier, onGameEnd, onPlayAgain }: WordWichGameProps) => {
  const navigate = useNavigate();
  const { addCompletion } = useGameProgress();
  const [puzzle, setPuzzle] = useState<WordPuzzle | null>(null);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [availableSyllables, setAvailableSyllables] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [streak, setStreak] = useState(0);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [fastestWord, setFastestWord] = useState<FastestWord | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const maxRounds = 8;

  const startTimer = useCallback(() => {
    setTimeLeft(TIMER_DURATION);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        // Timer counts down but doesn't force an answer - just affects speed bonus
        if (prev <= 0) {
          return 0; // Stop at 0, no penalty
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const loadNextPuzzle = useCallback((previouslyUsed: string[] = []) => {
    const newPuzzle = generateWordPuzzle(tier, previouslyUsed);
    setPuzzle(newPuzzle);
    setSelectedSyllables([]);
    setAvailableSyllables(newPuzzle.shuffledSyllables);
    setUsedWords(prev => [...prev, newPuzzle.word]);
    startTimer();
  }, [tier, startTimer]);

  useEffect(() => {
    loadNextPuzzle([]);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loadNextPuzzle]);

  const handleSyllableClick = (syllable: string, index: number) => {
    setSelectedSyllables([...selectedSyllables, syllable]);
    setAvailableSyllables(availableSyllables.filter((_, i) => i !== index));
  };

  const handleRemoveSyllable = (index: number) => {
    const syllable = selectedSyllables[index];
    setAvailableSyllables([...availableSyllables, syllable]);
    setSelectedSyllables(selectedSyllables.filter((_, i) => i !== index));
  };

  const calculateTimeBonus = (secondsLeft: number): number => {
    // Bonus points based on time remaining (max 15 bonus points)
    return Math.floor(secondsLeft);
  };

  const handleSubmit = () => {
    if (!puzzle || selectedSyllables.length === 0) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const userWord = selectedSyllables.join("");
    
    if (userWord.toLowerCase() === puzzle.word.toLowerCase()) {
      const basePoints = tier * 2 + streak;
      const timeBonus = calculateTimeBonus(timeLeft);
      const points = basePoints + timeBonus;
      setScore(score + points);
      setStreak(streak + 1);
      setCorrectCount(prev => prev + 1);
      
      // Track fastest word
      if (!fastestWord || timeLeft > fastestWord.timeRemaining) {
        setFastestWord({ word: puzzle.word, timeRemaining: timeLeft });
      }
      
      const bonusText = timeBonus > 0 ? ` (+${timeBonus} speed bonus!)` : "";
      toast.success("Delicious word! 🎉", {
        description: streak > 2 ? `${streak + 1} in a row! +${points} coins!${bonusText}` : `+${points} coins!${bonusText}`,
      });

      if (round >= maxRounds) {
        handleGameComplete(correctCount + 1, !fastestWord || timeLeft > fastestWord.timeRemaining ? { word: puzzle.word, timeRemaining: timeLeft } : fastestWord, score + points);
      } else {
        setRound(round + 1);
        loadNextPuzzle(usedWords);
      }
    } else {
      setStreak(0);
      toast.error("Not quite right! Try again!", {
        description: `The word was: ${puzzle.word}`,
      });

      if (round >= maxRounds) {
        handleGameComplete(correctCount, fastestWord, score);
      } else {
        setRound(round + 1);
        loadNextPuzzle(usedWords);
      }
    }
  };

  const handleGameComplete = (finalCorrect: number, finalFastest: FastestWord | null, finalScore: number) => {
    const maxScore = maxRounds * (tier * 2 + 5 + TIMER_DURATION); // Include max time bonus
    const percentage = Math.min(100, (finalScore / maxScore) * 100);

    addCompletion({
      gameId: "word-wich",
      tier,
      score: finalScore,
      maxScore,
      percentage,
    });
    
    setCorrectCount(finalCorrect);
    setFastestWord(finalFastest);
    setShowGameOver(true);
  };

  if (!puzzle) return null;

  const timerPercentage = (timeLeft / TIMER_DURATION) * 100;
  const timerColor = timeLeft <= 5 ? "text-destructive" : timeLeft <= 10 ? "text-warning" : "text-success";

  const progress = (round / maxRounds) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-accent/10 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-2xl w-full">
        {/* Header - compact on mobile */}
        <div className="bg-card border-4 border-border rounded-2xl p-3 sm:p-6 mb-3 sm:mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-2 sm:mb-4">
            <div className="text-sm sm:text-lg font-bold">
              Round {round}/{maxRounds}
            </div>
            <div className="text-lg sm:text-2xl font-bold text-primary">
              🪙 {score}
            </div>
            {streak > 1 && (
              <div className="text-sm sm:text-lg font-bold text-success animate-pulse">
                🔥 {streak}x
              </div>
            )}
          </div>
          <Progress value={progress} className="h-2 sm:h-3" />
          
          {/* Timer - compact on mobile */}
          <div className="mt-2 sm:mt-4 flex items-center gap-2 sm:gap-3">
            <Timer className={`h-4 w-4 sm:h-5 sm:w-5 ${timerColor}`} />
            <div className="flex-1 bg-muted rounded-full h-3 sm:h-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${
                  timeLeft <= 5 ? "bg-destructive" : timeLeft <= 10 ? "bg-warning" : "bg-success"
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
            <span className={`font-bold text-sm sm:text-lg min-w-[2rem] text-right ${timerColor}`}>
              +{timeLeft}
            </span>
          </div>
        </div>

        {/* Hint - compact on mobile */}
        <div className="bg-card border-4 border-border rounded-2xl p-3 sm:p-6 mb-3 sm:mb-6 shadow-lg animate-pop-in">
          <div className="text-center">
            <p className="text-sm sm:text-xl font-bold text-muted-foreground mb-1 sm:mb-2">Build this word:</p>
            <p className="text-lg sm:text-2xl text-foreground italic">{puzzle.hint}</p>
          </div>
        </div>

        {/* Selected Syllables (The Sandwich) - compact on mobile */}
        <div className="bg-card border-4 border-border rounded-2xl p-3 sm:p-6 mb-3 sm:mb-6 shadow-lg min-h-20 sm:min-h-32">
          <p className="text-center text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Your Word-wich:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center min-h-10 sm:min-h-16">
            {selectedSyllables.length === 0 ? (
              <p className="text-muted-foreground/50 italic text-sm sm:text-base">Tap syllables below!</p>
            ) : (
              selectedSyllables.map((syllable, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="lg"
                  className="text-lg sm:text-2xl font-bold h-10 sm:h-12 px-3 sm:px-4 touch-instant"
                  onClick={() => handleRemoveSyllable(index)}
                >
                  {syllable}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Available Syllables - larger touch targets on mobile */}
        <div className="bg-card border-4 border-border rounded-2xl p-3 sm:p-6 mb-3 sm:mb-6 shadow-lg">
          <p className="text-center text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Syllable Ingredients:</p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {availableSyllables.map((syllable, index) => (
              <Button
                key={index}
                variant="game"
                size="lg"
                className="text-xl sm:text-2xl font-bold h-12 sm:h-14 px-4 sm:px-6 min-w-[3.5rem] touch-instant"
                onClick={() => handleSyllableClick(syllable, index)}
              >
                {syllable}
              </Button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-3 sm:mb-6">
          <Button
            variant="default"
            size="lg"
            className="w-full text-lg sm:text-xl h-12 sm:h-16 touch-instant"
            onClick={handleSubmit}
            disabled={selectedSyllables.length === 0}
          >
            Submit Word
          </Button>
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

        {/* Game Over Dialog */}
        <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">🎊 Game Complete!</DialogTitle>
              <DialogDescription className="text-center">
                Great job building those words!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 bg-primary/10 rounded-xl">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Final Score</p>
                  <p className="text-2xl font-bold text-primary">{score} coins</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-success/10 rounded-xl">
                <Target className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Words Correct</p>
                  <p className="text-2xl font-bold text-success">{correctCount}/{maxRounds}</p>
                </div>
              </div>
              {fastestWord && (
                <div className="flex items-center gap-4 p-4 bg-warning/10 rounded-xl">
                  <Zap className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Fastest Word</p>
                    <p className="text-xl font-bold text-warning capitalize">{fastestWord.word}</p>
                    <p className="text-xs text-muted-foreground">{TIMER_DURATION - fastestWord.timeRemaining} second{TIMER_DURATION - fastestWord.timeRemaining !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Button className="w-full" onClick={() => { setShowGameOver(false); onPlayAgain?.(); }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setShowGameOver(false); onGameEnd(); }}>
                  Change Difficulty
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
