import { useEffect } from "react";
import { useGameProgress, ThemeId } from "@/contexts/GameProgressContext";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { selectedTheme } = useGameProgress();

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove(
      "theme-space",
      "theme-arctic",
      "theme-jungle",
      "theme-neon",
      "theme-sporty",
      "theme-dinosaur"
    );
    
    // Add the selected theme class if not default
    if (selectedTheme !== "default") {
      root.classList.add(`theme-${selectedTheme}`);
    }
  }, [selectedTheme]);

  return <>{children}</>;
};