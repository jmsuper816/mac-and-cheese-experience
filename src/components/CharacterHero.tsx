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

export const CharacterHero = () => {
  const { selectedOutfit } = useGameProgress();

  const outfitImages: Record<string, string> = {
    default: macCheeseDefault,
    burger: macCheeseBurger,
    taco: macCheeseTaco,
    hotdog: macCheeseHotdog,
    sushi: macCheeseSushi,
    avocado: macCheeseAvocado,
    cookies: macCheeseCookies,
    eggs: macCheeseEggs,
    pbj: macCheesePbj,
    spaghetti: macCheeseSpaghetti,
  };

  const currentImage = outfitImages[selectedOutfit] || macCheeseDefault;
  return (
    <div className="relative w-full bg-gradient-to-b from-primary/20 to-accent/20 rounded-3xl py-12 px-6 mb-8 overflow-hidden border-4 border-primary/30">
      {/* Decorative circles */}
      <div className="absolute top-4 left-4 w-16 h-16 bg-secondary/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-4 right-4 w-20 h-20 bg-accent/20 rounded-full blur-xl"></div>
      
      <div className="container mx-auto flex flex-col items-center text-center relative z-10">
        <div className="mb-6 animate-bounce-gentle">
          <img 
            src={currentImage} 
            alt="Mac the dog dressed as macaroni and Cheese the cat dressed as cheese" 
            className="h-64 w-auto object-contain drop-shadow-2xl"
          />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
          Mac & Cheese Games!
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mb-6">
          Join Mac and Cheese for silly, snack-filled learning adventures! 🎮✨
        </p>
      </div>
    </div>
  );
};
