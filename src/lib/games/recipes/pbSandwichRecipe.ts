import breadLoaf from "@/assets/kitchen/pb-sandwich/bread-loaf.webp";
import sliceOfBread from "@/assets/kitchen/pb-sandwich/slice-of-bread.webp";
import sliceWithPb from "@/assets/kitchen/pb-sandwich/slice-with-pb.webp";
import pbClosed from "@/assets/kitchen/pb-sandwich/peanut-butter-closed.webp";
import pbOpen from "@/assets/kitchen/pb-sandwich/peanut-butter-open.webp";
import pbSandwichFinished from "@/assets/kitchen/pb-sandwich/pb-sandwich-finished.webp";
import { RecipeData } from "./recipeTypes";

const pbSandwichRecipe: RecipeData = {
  id: "pb-sandwich",
  name: "Peanut Butter Sandwich",
  emoji: "🥪",
  tier: 1,
  finishedImage: pbSandwichFinished,
  steps: [
    {
      instruction: "Put a slice of bread down.",
      action: "drag",
      icon: sliceOfBread,
      dragItem: { id: "bread-loaf", image: breadLoaf, label: "Bread", dragImage: sliceOfBread },
      dropTarget: "workspace",
      sceneChanges: {
        workspace: sliceOfBread,
      },
    },
    {
      instruction: "Take the lid off the peanut butter.",
      action: "tap",
      icon: pbClosed,
      tapTarget: "pb-jar",
      sceneChanges: {
        "pb-jar": pbOpen,
      },
    },
    {
      instruction: "Spread peanut butter on the bread.",
      action: "drag",
      icon: pbOpen,
      dragItem: { id: "pb-jar", image: pbOpen, label: "Peanut Butter" },
      dropTarget: "workspace",
      sceneChanges: {
        workspace: sliceWithPb,
      },
    },
    {
      instruction: "Top with another slice of bread.",
      action: "drag",
      icon: sliceOfBread,
      dragItem: { id: "bread-loaf", image: breadLoaf, label: "Bread", dragImage: sliceOfBread },
      dropTarget: "workspace",
      sceneChanges: {
        workspace: pbSandwichFinished,
      },
    },
  ],
  easterEggs: [
    {
      objectId: "pb-jar",
      condition: "success",
      matchImage: pbOpen,
      sceneChanges: { "pb-jar": pbClosed },
      toastMessage: "🥜 You closed the jar!",
      confettiEmoji: "🥜",
    },
  ],
  sceneObjects: {
    workspace: {
      id: "workspace",
      image: "",
      position: { x: 50, y: 65 },
      size: { width: 32.5, height: 27.5 },
      isDropTarget: true,
    },
    "bread-loaf": {
      id: "bread-loaf",
      image: breadLoaf,
      position: { x: 15, y: 52 },
      size: { width: 35, height: 44 },
      isDraggable: true,
    },
    "pb-jar": {
      id: "pb-jar",
      image: pbClosed,
      position: { x: 85, y: 46 },
      size: { width: 26, height: 55 },
      isDraggable: true,
    },
  },
  initialVisibleObjects: ["workspace", "bread-loaf", "pb-jar"],
};

export default pbSandwichRecipe;
