import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pizza, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PatternPizzaGame } from "@/components/games/PatternPizzaGame";
import { GameTierCard } from "@/components/GameTierCard";

const PatternPizza = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tiers = [
    {
      id: 1 as const,
      title: "Simple Slice",
      description: "Easy repeating patterns",
      emoji: "🍕",
    },
    {
      id: 2 as const,
      title: "Extra Toppings",
      description: "More complex patterns to recognize",
      emoji: "🧀",
    },
    {
      id: 3 as const,
      title: "The Works",
      description: "Tricky patterns for pattern pros!",
      emoji: "🌶️",
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
      <PatternPizzaGame
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
            <Pizza className="h-12 w-12" style={{ color: '#f55832' }} />
            <h1 className="text-5xl font-bold text-foreground">Pattern Pizza</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Complete the pizza topping patterns!
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

export default PatternPizza;
