import kitchenBoardBg from "@/assets/kitchen/fruit-salad/kitchen-board-bg.webp";
import pileOfFruit from "@/assets/kitchen/fruit-salad/pile-of-fruit.webp";
import cutFruit from "@/assets/kitchen/fruit-salad/cut-fruit.webp";
import knife from "@/assets/kitchen/fruit-salad/knife.webp";
import emptyBowl from "@/assets/kitchen/fruit-salad/empty-bowl.webp";
import unmixedFruitSalad from "@/assets/kitchen/fruit-salad/unmixed-fruit-salad.webp";
import mixedFruitSalad from "@/assets/kitchen/fruit-salad/mixed-fruit-salad.webp";
import spoon from "@/assets/kitchen/fruit-salad/wooden-spoon.webp";

import kitchenBg from "@/assets/kitchen/kitchen-bg.png";
import { RecipeData } from "./recipeTypes";

const fruitSaladRecipe: RecipeData = {
  id: "fruit-salad",
  name: "Fruit Salad",
  emoji: "🥗",
  tier: 1,
  finishedImage: mixedFruitSalad,
  steps: [
    {
      instruction: "Cut up the fruits.",
      action: "drag",
      icon: knife,
      dragItem: { id: "knife", image: knife, label: "Knife" },
      dropTarget: "pile-of-fruit",
      sceneChanges: {
        "pile-of-fruit": cutFruit,
      },
    },
    {
      instruction: "Put the fruit into the bowl.",
      action: "drag",
      icon: cutFruit,
      dragItem: { id: "pile-of-fruit", image: cutFruit, label: "Cut Fruit" },
      dropTarget: "bowl",
      sceneChanges: {
        bowl: unmixedFruitSalad,
        bg: kitchenBg,
      },
      objectSizeChanges: {
        bowl: { width: 60, height: 56 },
      },
      objectPositionChanges: {
        bowl: { x: 50, y: 55 },
      },
      hideAfterDrop: ["pile-of-fruit", "knife"],
    },
    {
      instruction: "Mix!",
      action: "drag",
      icon: spoon,
      dragItem: { id: "spoon", image: spoon, label: "Spoon" },
      dropTarget: "bowl",
      sceneChanges: {
        bowl: mixedFruitSalad,
      },
      objectPositionChanges: {
        bowl: { x: 50, y: 55 },
      },
      objectSizeChanges: {
        bowl: { width: 70, height: 65 },
      },
      showOnStep: ["spoon"],
      hideAfterDrop: ["spoon"],
      animationDuring: {
        target: "bowl",
        image: unmixedFruitSalad,
        duration: 1000,
        className: "animate-wiggle",
      },
    },
  ],
  sceneObjects: {
    bg: {
      id: "bg",
      image: kitchenBoardBg,
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
    },
    "pile-of-fruit": {
      id: "pile-of-fruit",
      image: pileOfFruit,
      position: { x: 25, y: 62.5 },
      size: { width: 45, height: 45 },
      isDraggable: true,
      isDropTarget: true,
    },
    knife: {
      id: "knife",
      image: knife,
      position: { x: 50, y: 62.5 },
      size: { width: 27.5, height: 71.5 },
      isDraggable: true,
    },
    bowl: {
      id: "bowl",
      image: emptyBowl,
      position: { x: 75, y: 58 },
      size: { width: 48, height: 45 },
      isDropTarget: true,
    },
    spoon: {
      id: "spoon",
      image: spoon,
      position: { x: 75, y: 62 },
      size: { width: 22, height: 50 },
      isDraggable: true,
      hidden: true,
    },
  },
  initialVisibleObjects: ["bg", "pile-of-fruit", "knife", "bowl"],
};

export default fruitSaladRecipe;
