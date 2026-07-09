import { RecipeData } from "./recipeTypes";
import smoothieRecipe from "./smoothieRecipe";
import pbSandwichRecipe from "./pbSandwichRecipe";
import fruitSaladRecipe from "./fruitSaladRecipe";
import grilledCheeseRecipe from "./grilledCheeseRecipe";
import jellyToastRecipe from "./jellyToastRecipe";
import cerealBowlRecipe from "./cerealBowlRecipe";
import cheeseCrackersRecipe from "./cheeseCrackersRecipe";

// Registry of all available recipes
export const allRecipes: RecipeData[] = [pbSandwichRecipe, jellyToastRecipe, fruitSaladRecipe, smoothieRecipe, grilledCheeseRecipe, cerealBowlRecipe, cheeseCrackersRecipe];

export const getRecipeById = (id: string): RecipeData | undefined => {
  return allRecipes.find((r) => r.id === id);
};

export { type RecipeData, type RecipeStep, type SceneObjectDef, type DifficultyTier } from "./recipeTypes";
