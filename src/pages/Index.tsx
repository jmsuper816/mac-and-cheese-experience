import { CharacterHero } from "@/components/CharacterHero";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  BookOpen, 
  Pizza, 
  Apple, 
  ChefHat,
  Sparkles,
  Book,
  Settings,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const handleGameClick = (gameId: string, gameName: string) => {
    if (gameId === "count-crunch") {
      navigate("/count-crunch");
    } else if (gameId === "word-wich") {
      navigate("/word-wich");
    } else if (gameId === "pattern-pizza") {
      navigate("/pattern-pizza");
    } else if (gameId === "sort-n-snack") {
      navigate("/sort-n-snack");
    } else if (gameId === "kitchen-dash") {
      navigate("/kitchen-dash");
    } else if (gameId === "snack-attack") {
      navigate("/snack-attack");
    } else if (gameId === "sticker-book") {
      navigate("/sticker-book");
    } else if (gameId === "wardrobe") {
      navigate("/wardrobe");
    } else {
      toast.success(`${gameName} is coming soon! 🎮`, {
        description: "We're cooking up something delicious!",
        duration: 3000,
      });
    }
  };

  const games = [
    {
      id: "count-crunch",
      title: "Count Crunch",
      description: "Count yummy foods and solve tasty math puzzles!",
      icon: Calculator,
      color: "bg-gradient-to-br from-primary to-primary-glow",
    },
    {
      id: "word-wich",
      title: "Word-wich",
      description: "Build words by stacking syllable sandwiches!",
      icon: BookOpen,
      color: "bg-[#45bcfa]",
    },
    {
      id: "pattern-pizza",
      title: "Pattern Pizza",
      description: "Top pizzas with patterns - can you complete them?",
      icon: Pizza,
      color: "bg-[#f55832]",
    },
    {
      id: "sort-n-snack",
      title: "Sort-n-Snack",
      description: "Sort foods into healthy groups and learn good choices!",
      icon: Apple,
      color: "bg-gradient-to-br from-success to-success/80",
    },
    {
      id: "kitchen-dash",
      title: "Kitchen Dash",
      description: "Follow recipe steps and cook up learning fun!",
      icon: ChefHat,
      color: "bg-[#ff8c42]",
    },
    {
      id: "snack-attack",
      title: "Snack Attack",
      description: "Dodge flying foods and test your reflexes!",
      icon: Zap,
      color: "bg-[#9b5de5]",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <CharacterHero />

        {/* Games Grid */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 text-foreground flex items-center justify-center gap-2">
              <Sparkles className="text-primary animate-pulse" />
              Choose Your Adventure
              <Sparkles className="text-primary animate-pulse" />
            </h2>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {games.map((game, index) => (
              <div
                key={game.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <GameCard
                  title={game.title}
                  description={game.description}
                  icon={game.icon}
                  color={game.color}
                  onClick={() => handleGameClick(game.id, game.title)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Navigation */}
        <section className="flex flex-wrap gap-4 justify-center items-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/sticker-book")}
            className="gap-2"
          >
            <Book className="h-5 w-5" />
            Sticker Book
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/wardrobe")}
            className="gap-2"
          >
            <Sparkles className="h-5 w-5" />
            Wardrobe
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate("/settings")}
            className="gap-2"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground border-t border-border pt-6">
          <p className="mb-2">Made with ❤️ for kids who love to learn and play!</p>
          <p>Safe, fun, and educational • No ads • No data collection</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
