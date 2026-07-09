import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Lock, Palette, Check, Calculator, Pizza, Apple, ChefHat, Zap, LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGameProgress, THEMES } from "@/contexts/GameProgressContext";
import { toast } from "sonner";
import { GAME_THRESHOLDS, getTierRequirement, getTierInfo } from "@/lib/games/gameThresholds";

const gameIcons: Record<string, LucideIcon> = {
  "count-crunch": Calculator,
  "word-wich": BookOpen,
  "pattern-pizza": Pizza,
  "sort-n-snack": Apple,
  "kitchen-dash": ChefHat,
  "snack-attack": Zap,
};

const StickerBook = () => {
  const navigate = useNavigate();
  const { getUnlockedStickers, hasCompletedGame, hasUnlockedTheme, selectedTheme, setSelectedTheme } = useGameProgress();
  const unlockedStickers = getUnlockedStickers();

  const games = GAME_THRESHOLDS.map((g) => ({
    id: g.gameId,
    name: g.name,
    emoji: g.emoji,
    icon: gameIcons[g.gameId],
  }));

  const tierColors = selectedTheme === "default" 
    ? ["bg-[#45bcfa]", "bg-yellow-400", "bg-[#f55832]"]
    : ["bg-primary", "bg-warning", "bg-accent"];

  const getThemeForGame = (gameId: string) => {
    return THEMES.find(t => t.gameId === gameId);
  };

  const handleThemeClick = (gameId: string) => {
    const theme = getThemeForGame(gameId);
    if (!theme) return;

    if (!hasUnlockedTheme(gameId)) {
      toast.error("Complete all 3 levels to unlock this theme!");
      return;
    }

    if (selectedTheme === theme.id) {
      setSelectedTheme("default");
      toast.success("Switched back to default theme!");
    } else {
      setSelectedTheme(theme.id);
      toast.success(`${theme.name} theme activated! ${theme.emoji}`);
    }
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
            <BookOpen className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">Sticker Book</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Collect stickers by completing levels with 60% or higher!
          </p>
          <p className="text-lg text-primary font-semibold mb-2">
            {unlockedStickers.length} / {games.length * 3} Stickers Collected
          </p>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Palette className="h-4 w-4" />
            Complete all 3 levels of a game to unlock its theme!
          </p>
        </div>

        <div className="space-y-8">
          {games.map((game) => {
            const theme = getThemeForGame(game.id);
            const isThemeUnlocked = hasUnlockedTheme(game.id);
            const isThemeActive = theme && selectedTheme === theme.id;

            return (
              <Card key={game.id} className={`border-4 transition-all duration-300 ${isThemeActive ? 'ring-4 ring-primary shadow-lg' : ''}`}>
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        {game.icon && <game.icon className="h-7 w-7 text-primary" />}
                        {game.name}
                      </CardTitle>
                      <CardDescription>Complete each level to unlock stickers!</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/${game.id}`)}
                        className="gap-2"
                      >
                        Play Game
                      </Button>
                    {theme && (
                      <Button
                        variant={isThemeActive ? "default" : isThemeUnlocked ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => handleThemeClick(game.id)}
                        className={`gap-2 ${!isThemeUnlocked ? 'opacity-50' : ''}`}
                      >
                        {isThemeActive ? (
                          <>
                            <Check className="h-4 w-4" />
                            {theme.name} Active
                          </>
                        ) : isThemeUnlocked ? (
                          <>
                            <Palette className="h-4 w-4" />
                            {theme.emoji} {theme.name} Theme
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4" />
                            {theme.emoji} {theme.name} Locked
                          </>
                        )}
                      </Button>
                    )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((tierId) => {
                      const isUnlocked = hasCompletedGame(game.id, tierId);
                      const tierInfo = getTierInfo(game.id, tierId);
                      const tierColor = tierColors[tierId - 1];

                      return (
                        <div
                          key={tierId}
                          className={`
                            relative p-6 rounded-xl border-4 transition-all duration-300
                            ${isUnlocked 
                              ? `${tierColor} shadow-lg` 
                              : 'bg-muted border-muted-foreground/20'
                            }
                          `}
                        >
                          {isUnlocked ? (
                            <div className="text-center">
                              <div className="text-6xl mb-3 animate-bounce-gentle">
                                {tierInfo?.emoji || game.emoji}
                              </div>
                              <h3 className="font-bold text-lg text-foreground mb-1">
                                {tierInfo?.name || `Level ${tierId}`}
                              </h3>
                              <div className="inline-flex items-center gap-1 bg-card/80 text-foreground px-3 py-1 rounded-full text-sm font-semibold">
                                ✓ Unlocked
                              </div>
                            </div>
                          ) : (
                            <div className="text-center opacity-50 relative">
                              <div className="text-6xl mb-3 opacity-30 grayscale">
                                {tierInfo?.emoji || game.emoji}
                              </div>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Lock className="h-12 w-12 text-muted-foreground" />
                              </div>
                              <h3 className="font-bold text-lg text-muted-foreground mb-1 mt-8">
                                {tierInfo?.name || `Level ${tierId}`}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {getTierRequirement(game.id, tierId)}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StickerBook;