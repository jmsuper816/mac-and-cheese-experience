import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChefHat, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KitchenDashGame } from "@/components/games/KitchenDashGame";
import { allRecipes, RecipeData, DifficultyTier } from "@/lib/games/recipes";
import { getDishImage } from "@/lib/games/dishImages";

const KitchenDash = () => {
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeData | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier | null>(null);

  if (selectedRecipe && selectedDifficulty) {
    return (
      <KitchenDashGame
        recipe={selectedRecipe}
        difficulty={selectedDifficulty}
        onBack={() => setSelectedDifficulty(null)}
        onChangeDifficulty={() => setSelectedDifficulty(null)}
        onNewRecipe={() => {
          setSelectedRecipe(null);
          setSelectedDifficulty(null);
        }}
      />
    );
  }

  // Tier selection after picking a recipe
  if (selectedRecipe && !selectedDifficulty) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedRecipe(null)}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Button>

          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-card shadow-lg border-4 border-primary/20">
              {selectedRecipe.finishedImage ? (
                <img src={selectedRecipe.finishedImage} alt={selectedRecipe.name} className="w-16 h-16 object-contain" />
              ) : (
                <span className="text-5xl">{selectedRecipe.emoji}</span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{selectedRecipe.name}</h1>
            <p className="text-lg text-muted-foreground">Choose your difficulty!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Junior Chef */}
            <Card
              className="group cursor-pointer overflow-hidden border-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              onClick={() => setSelectedDifficulty("junior")}
            >
              <CardHeader className="bg-[#45bcfa] text-center pb-4">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">👨‍🍳</span>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Junior Chef
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 pb-6 bg-card">
                <p className="text-base mb-4 text-muted-foreground">
                  Step-by-step instructions with pictures
                </p>
                <Button
                  size="lg"
                  className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Start
                </Button>
              </CardContent>
            </Card>

            {/* Master Chef */}
            <Card
              className="group cursor-pointer overflow-hidden border-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              onClick={() => setSelectedDifficulty("master")}
            >
              <CardHeader className="bg-[#f55832] text-center pb-4">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">⭐</span>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Master Chef
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 pb-6 bg-card">
                <p className="text-base mb-4 text-muted-foreground">
                  No instructions — cook from memory!
                </p>
                <Button
                  size="lg"
                  className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Start
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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
            <ChefHat className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">Kitchen Dash</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Pick a recipe and cook it step by step!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {[...allRecipes].sort((a, b) => a.name.localeCompare(b.name)).map((recipe) => (
            <Card
              key={recipe.id}
              className="group cursor-pointer overflow-hidden border-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-full sm:w-72"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <CardHeader className="bg-[#45bcfa] text-center pb-4">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {recipe.finishedImage ? (
                    <img src={recipe.finishedImage} alt={recipe.name} className="w-14 h-14 object-contain" />
                  ) : (
                    <span className="text-4xl">{recipe.emoji}</span>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {recipe.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-4 pb-6 bg-card">
                <p className="text-base mb-4 text-muted-foreground">
                  {recipe.steps.length} steps
                </p>
                <Button
                  size="lg"
                  className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Let's Cook!
                </Button>
              </CardContent>
            </Card>
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

export default KitchenDash;
