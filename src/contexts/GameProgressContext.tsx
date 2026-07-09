import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getGameThreshold } from "@/lib/games/gameThresholds";

interface GameCompletion {
  gameId: string;
  tier: number;
  score: number;
  maxScore: number;
  percentage: number;
  completedAt: Date;
}

export type ThemeId = "default" | "space" | "arctic" | "jungle" | "neon" | "sporty" | "dinosaur";

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  emoji: string;
  gameId: string;
}

export const THEMES: ThemeInfo[] = [
  { id: "space", name: "Space", emoji: "🚀", gameId: "count-crunch" },
  { id: "neon", name: "Neon", emoji: "💜", gameId: "pattern-pizza" },
  { id: "jungle", name: "Jungle", emoji: "🌴", gameId: "word-wich" },
  { id: "arctic", name: "Arctic", emoji: "❄️", gameId: "sort-n-snack" },
  { id: "dinosaur", name: "Dinosaur", emoji: "🦖", gameId: "kitchen-dash" },
  { id: "sporty", name: "Sporty", emoji: "⚽", gameId: "snack-attack" },
];

interface GameProgressContextType {
  completions: GameCompletion[];
  selectedOutfit: string;
  selectedTheme: ThemeId;
  addCompletion: (completion: Omit<GameCompletion, 'completedAt'>) => void;
  setSelectedOutfit: (outfit: string) => void;
  setSelectedTheme: (theme: ThemeId) => void;
  getUnlockedStickers: () => string[];
  hasCompletedGame: (gameId: string, tier: number) => boolean;
  hasUnlockedTheme: (gameId: string) => boolean;
  getUnlockedThemes: () => ThemeInfo[];
}

const GameProgressContext = createContext<GameProgressContextType | undefined>(undefined);

const STORAGE_KEY = "mac-cheese-game-progress";
const OUTFIT_KEY = "mac-cheese-selected-outfit";
const THEME_KEY = "mac-cheese-selected-theme";

export const GameProgressProvider = ({ children }: { children: ReactNode }) => {
  const [completions, setCompletions] = useState<GameCompletion[]>([]);
  const [selectedOutfit, setSelectedOutfitState] = useState<string>("default");
  const [selectedTheme, setSelectedThemeState] = useState<ThemeId>("default");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setCompletions(parsed.map((c: any) => ({
        ...c,
        completedAt: new Date(c.completedAt)
      })));
    }

    const storedOutfit = localStorage.getItem(OUTFIT_KEY);
    if (storedOutfit) {
      setSelectedOutfitState(storedOutfit);
    }

    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme) {
      setSelectedThemeState(storedTheme as ThemeId);
    }
  }, []);

  // Save to localStorage whenever completions change
  useEffect(() => {
    if (completions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completions));
    }
  }, [completions]);

  const addCompletion = (completion: Omit<GameCompletion, 'completedAt'>) => {
    const newCompletion = {
      ...completion,
      completedAt: new Date()
    };

    setCompletions(prev => {
      // Replace if same game and tier exists, otherwise add
      const existingIndex = prev.findIndex(
        c => c.gameId === completion.gameId && c.tier === completion.tier
      );

      if (existingIndex >= 0) {
        // Only update if new score is higher
        if (prev[existingIndex].score < completion.score) {
          const updated = [...prev];
          updated[existingIndex] = newCompletion;
          return updated;
        }
        return prev;
      }

      return [...prev, newCompletion];
    });
  };

  const setSelectedOutfit = (outfit: string) => {
    setSelectedOutfitState(outfit);
    localStorage.setItem(OUTFIT_KEY, outfit);
  };

  const setSelectedTheme = (theme: ThemeId) => {
    setSelectedThemeState(theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  const checkTierCompletion = (gameId: string, tier: number, completion: GameCompletion): boolean => {
    const gameThreshold = getGameThreshold(gameId);
    if (!gameThreshold) return completion.percentage >= 60;
    
    const tierData = gameThreshold.tiers[tier as 1 | 2 | 3];
    if (!tierData) return completion.percentage >= 60;
    
    if (gameThreshold.type === "points") {
      // For point-based games, check if score meets the threshold
      return completion.score >= tierData.threshold;
    }
    // For percentage-based games, check percentage
    return completion.percentage >= tierData.threshold;
  };

  const getUnlockedStickers = () => {
    const unlocked: string[] = [];
    
    const games = ["count-crunch", "pattern-pizza", "word-wich", "sort-n-snack", "kitchen-dash", "snack-attack"];
    
    games.forEach(gameId => {
      [1, 2, 3].forEach(tier => {
        const completion = completions.find(
          c => c.gameId === gameId && c.tier === tier
        );
        if (completion && checkTierCompletion(gameId, tier, completion)) {
          unlocked.push(`${gameId}-tier${tier}`);
        }
      });
    });

    return unlocked;
  };

  const hasCompletedGame = (gameId: string, tier: number) => {
    const completion = completions.find(
      c => c.gameId === gameId && c.tier === tier
    );
    if (!completion) return false;
    return checkTierCompletion(gameId, tier, completion);
  };

  const hasUnlockedTheme = (gameId: string) => {
    // Theme is unlocked when all 3 tiers are completed for a game
    return [1, 2, 3].every(tier => hasCompletedGame(gameId, tier));
  };

  const getUnlockedThemes = () => {
    return THEMES.filter(theme => hasUnlockedTheme(theme.gameId));
  };

  return (
    <GameProgressContext.Provider
      value={{
        completions,
        selectedOutfit,
        selectedTheme,
        addCompletion,
        setSelectedOutfit,
        setSelectedTheme,
        getUnlockedStickers,
        hasCompletedGame,
        hasUnlockedTheme,
        getUnlockedThemes,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  );
};

export const useGameProgress = () => {
  const context = useContext(GameProgressContext);
  if (!context) {
    throw new Error("useGameProgress must be used within GameProgressProvider");
  }
  return context;
};
