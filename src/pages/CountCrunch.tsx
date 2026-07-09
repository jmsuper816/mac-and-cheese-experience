import { useState } from "react";
import { CountCrunchGame } from "@/components/games/CountCrunchGame";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GameTierCard } from "@/components/GameTierCard";

export type DifficultyTier = 1 | 2 | 3;

const CountCrunch = () => {
  const navigate = useNavigate();
  const [tier, setTier] = useState<DifficultyTier>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const tiers = [
    {
      id: 1 as const,
      title: "Easy Peasy",
      description: "Count and choose the right number",
      emoji: "🍎",
    },
    {
      id: 2 as const,
      title: "Getting Tasty",
      description: "Add what you see",
      emoji: "🥣",
    },
    {
      id: 3 as const,
      title: "Super Chef",
      description: "Timed addition challenges",
      emoji: "👨‍🍳",
    },
  ];

  const handleStart = (selectedTier: DifficultyTier) => {
    setTier(selectedTier);
    setIsPlaying(true);
  };

  const handleGameEnd = () => {
    setIsPlaying(false);
  };

  if (isPlaying) {
    return <CountCrunchGame tier={tier} onGameEnd={handleGameEnd} />;
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
            <Calculator className="h-12 w-12" style={{ color: '#ffb813' }} />
            Count Crunch
          </h1>
          <p className="text-xl text-muted-foreground">
            Count yummy foods and solve tasty math puzzles!
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

export default CountCrunch;
