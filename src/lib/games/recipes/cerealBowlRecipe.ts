import cerealBox from "@/assets/kitchen/cereal-bowl/cereal-box.webp";
import emptyBowl from "@/assets/kitchen/cereal-bowl/empty-bowl.webp";
import bowlCereal from "@/assets/kitchen/cereal-bowl/bowl-cereal.webp";
import bowlMilk from "@/assets/kitchen/cereal-bowl/bowl-milk.webp";
import bowlSpoon from "@/assets/kitchen/cereal-bowl/bowl-spoon.webp";
import spoon from "@/assets/kitchen/cereal-bowl/spoon.webp";
import milkJug from "@/assets/kitchen/cereal-bowl/milk-jug.webp";
import kitchenBg from "@/assets/kitchen/cereal-bowl/kitchen-bg.png";
import { RecipeData } from "./recipeTypes";

const cerealBowlRecipe: RecipeData = {
  id: "cereal-bowl",
  name: "Cereal Bowl",
  emoji: "🥣",
  tier: 1,
  finishedImage: bowlSpoon,
  steps: [
    {
      instruction: "Pour cereal into the bowl.",
      action: "drag",
      icon: cerealBox,
      dragItem: { id: "cereal-box", image: cerealBox, label: "Cereal Box" },
      dropTarget: "bowl",
      sceneChanges: {
        bowl: bowlCereal,
      },
    },
    {
      instruction: "Add milk.",
      action: "drag",
      icon: milkJug,
      dragItem: { id: "milk-jug", image: milkJug, label: "Milk Jug" },
      dropTarget: "bowl",
      sceneChanges: {
        bowl: bowlMilk,
      },
    },
    {
      instruction: "Add a spoon.",
      action: "drag",
      icon: spoon,
      dragItem: { id: "spoon", image: spoon, label: "Spoon" },
      dropTarget: "bowl",
      sceneChanges: {
        bowl: "",
        "milk-jug": "",
        "cereal-box": "",
        "finished-dish": bowlSpoon,
      },
      objectSizeChanges: {
        "finished-dish": { width: 65, height: 55 },
      },
      hideAfterDrop: ["spoon"],
    },
  ],
  sceneObjects: {
    bg: {
      id: "bg",
      image: kitchenBg,
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
    },
    "milk-jug": {
      id: "milk-jug",
      image: milkJug,
      position: { x: 15, y: 55 },
      size: { width: 25, height: 50 },
      isDraggable: true,
    },
    bowl: {
      id: "bowl",
      image: emptyBowl,
      position: { x: 50, y: 62 },
      size: { width: 40, height: 35 },
      isDropTarget: true,
    },
    "cereal-box": {
      id: "cereal-box",
      image: cerealBox,
      position: { x: 82, y: 55 },
      size: { width: 28, height: 50 },
      isDraggable: true,
    },
    spoon: {
      id: "spoon",
      image: spoon,
      position: { x: 65, y: 78 },
      size: { width: 28, height: 15 },
      isDraggable: true,
    },
    "finished-dish": {
      id: "finished-dish",
      image: "",
      position: { x: 50, y: 55 },
      size: { width: 40, height: 35 },
    },
  },
  initialVisibleObjects: ["bg", "milk-jug", "bowl", "cereal-box", "spoon", "finished-dish"],
};

export default cerealBowlRecipe;
