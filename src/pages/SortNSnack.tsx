import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Apple, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SortNSnackGame } from "@/components/games/SortNSnackGame";
import { GameTierCard } from "@/components/GameTierCard";

const SortNSnack = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tiers = [
    {
      id: 1 as const,
      title: "Healthy Start",
      description: "Healthy or not-so-healthy?",
      emoji: "🍎",
    },
    {
      id: 2 as const,
      title: "Food Groups",
      description: "Match foods to their food groups!",
      emoji: "🥦",
    },
    {
      id: 3 as const,
      title: "Food Origins",
      description: "Where does your food come from?",
      emoji: "🍳",
    },
  ];

  const handleTierSelect = (tierId: number) => {
    setSelectedTier(tierId);
    setIsPlaying(true);
  };

  const handleBackToTiers = () => {
    setIsPlaying(false);
    setSelectedTier(null);
  };

  if (isPlaying && selectedTier) {
    return (
      <SortNSnackGame
        tier={selectedTier}
        onBack={handleBackToTiers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Apple className="h-12 w-12 text-success" />
            <h1 className="text-5xl font-bold text-foreground">Sort-n-Snack</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Sort foods into healthy groups and learn good choices!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tiers.map((tier) => (
            <GameTierCard
              key={tier.id}
              tier={tier.id}
              title={tier.title}
              description={tier.description}
              emoji={tier.emoji}
              onSelect={() => handleTierSelect(tier.id)}
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

export default SortNSnack;
