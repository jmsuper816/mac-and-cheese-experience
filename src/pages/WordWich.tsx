import { useState } from "react";
import { WordWichGame } from "@/components/games/WordWichGame";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GameTierCard } from "@/components/GameTierCard";

export type DifficultyTier = 1 | 2 | 3;

const WordWich = () => {
  const navigate = useNavigate();
  const [tier, setTier] = useState<DifficultyTier>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const tiers = [
    {
      id: 1 as const,
      title: "Little Bites",
      description: "2-syllable words",
      emoji: "🧁",
    },
    {
      id: 2 as const,
      title: "Full Stack",
      description: "3-syllable words",
      emoji: "🥪",
    },
    {
      id: 3 as const,
      title: "Mega Stack",
      description: "4-syllable word challenges",
      emoji: "🌮",
    },
  ];

  const handleStart = (selectedTier: DifficultyTier) => {
    setTier(selectedTier);
    setIsPlaying(true);
  };

  const handleGameEnd = () => {
    setIsPlaying(false);
  };

  const handlePlayAgain = () => {
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 0);
  };

  if (isPlaying) {
    return <WordWichGame tier={tier} onGameEnd={handleGameEnd} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 text-foreground flex items-center justify-center gap-3">
            <BookOpen className="h-12 w-12" style={{ color: '#45bcfa' }} />
            Word-wich
          </h1>
          <p className="text-xl text-muted-foreground">
            Stack syllables to build delicious words!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tiers.map((tierData) => (
            <GameTierCard
              key={tierData.id}
              tier={tierData.id}
              title={tierData.title}
              description={tierData.description}
              emoji={tierData.emoji}
              onSelect={() => handleStart(tierData.id)}
            />
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" onClick={() => navigate("/")} className="gap-2">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WordWich;
