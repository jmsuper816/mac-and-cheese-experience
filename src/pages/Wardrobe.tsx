import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shirt, Check } from "lucide-react";
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
import { toast } from "sonner";

const Wardrobe = () => {
  const navigate = useNavigate();
  const { selectedOutfit, setSelectedOutfit } = useGameProgress();

  const outfits = [
    { id: "default", name: "Mac & Cheese", image: macCheeseDefault, description: "The classic duo!" },
    { id: "burger", name: "Burger & Fry", image: macCheeseBurger, description: "Dressed as burgers!" },
    { id: "taco", name: "Taco & Salsa", image: macCheeseTaco, description: "Taco time!" },
    { id: "hotdog", name: "Hotdog & Ketchup", image: macCheeseHotdog, description: "Hot dog style!" },
    { id: "sushi", name: "Sushi & Dumpling", image: macCheeseSushi, description: "Sushi sensation!" },
    { id: "avocado", name: "Avocado & Toast", image: macCheeseAvocado, description: "Healthy choice!" },
    { id: "cookies", name: "Cookies & Milk", image: macCheeseCookies, description: "Sweet treats!" },
    { id: "eggs", name: "Eggs & Bacon", image: macCheeseEggs, description: "Breakfast crew!" },
    { id: "pbj", name: "PB & J", image: macCheesePbj, description: "Best friends forever!" },
    { id: "spaghetti", name: "Spaghetti & Meatball", image: macCheeseSpaghetti, description: "Pasta pals!" },
  ];

  const handleOutfitSelect = (outfitId: string) => {
    setSelectedOutfit(outfitId);
    const outfit = outfits.find(o => o.id === outfitId);
    toast.success(`Outfit changed to ${outfit?.name}!`, {
      description: "Your new outfit will appear throughout the game!",
      duration: 2000,
    });
  };

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
            <Shirt className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">Wardrobe</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Choose an outfit for Mac and Cheese!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit) => {
            const isSelected = selectedOutfit === outfit.id;

            return (
              <Card
                key={outfit.id}
                className={`
                  group cursor-pointer overflow-hidden transition-all duration-300 
                  hover:shadow-2xl hover:-translate-y-2
                  ${isSelected ? 'border-primary border-4 shadow-xl' : 'border-4'}
                `}
                onClick={() => handleOutfitSelect(outfit.id)}
              >
                <CardHeader className="bg-gradient-to-b from-primary/10 to-transparent pb-2">
                  <div className="relative">
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      className="h-48 w-auto object-contain mx-auto drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                        <Check className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-center pt-4">
                  <CardTitle className="text-xl mb-2">{outfit.name}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {outfit.description}
                  </CardDescription>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOutfitSelect(outfit.id);
                    }}
                  >
                    {isSelected ? "Currently Wearing" : "Wear This"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;
