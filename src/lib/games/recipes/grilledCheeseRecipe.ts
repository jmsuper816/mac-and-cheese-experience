// Grilled Cheese recipe — all custom assets
import breadLoaf from "@/assets/kitchen/pb-sandwich/bread-loaf.webp";
import sliceOfBread from "@/assets/kitchen/pb-sandwich/slice-of-bread.webp";
import butterStick from "@/assets/kitchen/grilled-cheese/butter-stick.webp";
import breadButter1 from "@/assets/kitchen/grilled-cheese/bread-butter1.webp";
import breadButter2 from "@/assets/kitchen/grilled-cheese/bread-butter2.webp";
import breadCheese from "@/assets/kitchen/grilled-cheese/bread-cheese.webp";
import almostGrilledCheese from "@/assets/kitchen/grilled-cheese/almost-grilled-cheese.webp";
import grilledCheese from "@/assets/kitchen/grilled-cheese/grilled-cheese.webp";
import panBread from "@/assets/kitchen/grilled-cheese/pan-bread.webp";
import panBreadCheese from "@/assets/kitchen/grilled-cheese/pan-bread-cheese.webp";
import panAlmostGrilledCheese from "@/assets/kitchen/grilled-cheese/pan-almost-grilled-cheese.webp";
import panGrilledCheese from "@/assets/kitchen/grilled-cheese/pan-grilled-cheese.webp";
import kitchenStove from "@/assets/kitchen/grilled-cheese/kitchen-stove.webp";
import kitchenStoveOn from "@/assets/kitchen/grilled-cheese/kitchen-stove-on.webp";
import timerImg from "@/assets/kitchen/grilled-cheese/timer.webp";
import cheesePile from "@/assets/kitchen/grilled-cheese/cheese-pile.webp";
import sliceOfCheese from "@/assets/kitchen/grilled-cheese/slice-of-cheese.webp";
import pan from "@/assets/kitchen/grilled-cheese/pan.webp";
import spatula from "@/assets/kitchen/grilled-cheese/spatula.webp";
import kitchenBg from "@/assets/kitchen/grilled-cheese/kitchen-bg.png";
import { RecipeData } from "./recipeTypes";

const grilledCheeseRecipe: RecipeData = {
  id: "grilled-cheese",
  name: "Grilled Cheese",
  emoji: "🧀",
  tier: 2,
  finishedImage: grilledCheese,
  steps: [
    // Step 1: Get first slice of bread
    {
      instruction: "Get two slices of bread.",
      action: "drag",
      icon: sliceOfBread,
      dragItem: { id: "bread-loaf", image: breadLoaf, label: "Bread", dragImage: sliceOfBread },
      dropTarget: "workspace",
      sceneChanges: {
        slice1: sliceOfBread,
      },
    },
    // Step 2: Get second slice of bread
    {
      instruction: "Get two slices of bread.",
      action: "drag",
      icon: sliceOfBread,
      dragItem: { id: "bread-loaf", image: breadLoaf, label: "Bread", dragImage: sliceOfBread },
      dropTarget: "workspace",
      showOnStep: ["slice1"],
      sceneChanges: {
        slice2: sliceOfBread,
      },
    },
    // Step 3: Butter first slice (either slice works)
    {
      instruction: "Butter two slices of bread.",
      action: "drag",
      icon: butterStick,
      dragItem: { id: "butter-stick", image: butterStick, label: "Butter" },
      dropTarget: "slice1",
      alternativeDropTargets: [{ id: "slice2", sceneChanges: { slice2: breadButter2 } }],
      showOnStep: ["slice2"],
      sceneChanges: {
        slice1: breadButter1,
      },
    },
    // Step 4: Butter second slice (either slice works)
    {
      instruction: "Butter two slices of bread.",
      action: "drag",
      icon: butterStick,
      dragItem: { id: "butter-stick", image: butterStick, label: "Butter" },
      dropTarget: "slice2",
      alternativeDropTargets: [{ id: "slice1", sceneChanges: { slice1: breadButter1 } }],
      sceneChanges: {
        slice2: breadButter2,
      },
    },
    // Step 5: Put one slice on the pan (either slice works)
    {
      instruction: "Put one slice on the pan.",
      action: "drag",
      icon: breadButter1,
      dragItem: { id: "slice1", image: breadButter1, label: "Buttered Bread" },
      alternativeDragIds: ["slice2"],
      dropTarget: "pan-food",
      sceneChanges: {
        pan: panBread,
      },
      hideAfterDrop: ["slice1"],
    },
    // Step 6: Put cheese on bread
    {
      instruction: "Put cheese between bread slices.",
      action: "drag",
      icon: cheesePile,
      dragItem: { id: "cheese-pile", image: cheesePile, label: "Cheese", dragImage: sliceOfCheese },
      dropTarget: "pan-food",
      sceneChanges: {
        pan: panBreadCheese,
      },
    },
    // Step 7: Top with the other bread slice (either slice works)
    {
      instruction: "Top with the other bread slice.",
      action: "drag",
      icon: breadButter2,
      dragItem: { id: "slice2", image: breadButter2, label: "Buttered Bread" },
      alternativeDragIds: ["slice1"],
      dropTarget: "pan-food",
      sceneChanges: {
        pan: panAlmostGrilledCheese,
      },
      hideAfterDrop: ["slice2"],
    },
    // Step 8: Turn the stove on
    {
      instruction: "Turn the stove on.",
      action: "tap",
      icon: kitchenStoveOn,
      tapTarget: "stove-button",
      sceneChanges: {
        bg: kitchenStoveOn,
      },
    },
    // Step 9: Wait — cook
    {
      instruction: "Cook sandwich until golden. Wait!",
      action: "wait",
      icon: timerImg,
      waitDuration: 3500,
      waitImage: timerImg,
    },
    // Step 10: Flip with spatula
    {
      instruction: "Flip!",
      action: "drag",
      icon: spatula,
      dragItem: { id: "spatula", image: spatula, label: "Spatula" },
      dropTarget: "pan-food",
      showOnStep: ["spatula"],
      hideAfterDrop: ["spatula"],
      sceneChanges: {
        pan: panGrilledCheese,
      },
    },
    // Step 11: Wait — cook again
    {
      instruction: "Cook sandwich until golden. Wait!",
      action: "wait",
      icon: timerImg,
      waitDuration: 3500,
      waitImage: timerImg,
    },
    // Step 12: Turn off the stove
    {
      instruction: "Turn off the stove.",
      action: "tap",
      icon: kitchenStove,
      tapTarget: "stove-button",
      sceneChanges: {
        bg: kitchenBg,
        pan: "",
        "pan-food": "",
        "bread-loaf": "",
        "cheese-pile": "",
        "butter-stick": "",
        "finished-dish": grilledCheese,
      },
      objectSizeChanges: {
        "finished-dish": { width: 55, height: 55 },
      },
    },
  ],
  sceneObjects: {
    bg: {
      id: "bg",
      image: kitchenStove,
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
    },
    "bread-loaf": {
      id: "bread-loaf",
      image: breadLoaf,
      position: { x: 16.5, y: 52 },
      size: { width: 34, height: 36 },
      isDraggable: true,
    },
    "butter-stick": {
      id: "butter-stick",
      image: butterStick,
      position: { x: 60, y: 48 },
      size: { width: 20, height: 12 },
      isDraggable: true,
    },
    slice1: {
      id: "slice1",
      image: sliceOfBread,
      position: { x: 15, y: 76 },
      size: { width: 20, height: 20 },
      isDraggable: true,
      isDropTarget: true,
      hidden: true,
    },
    slice2: {
      id: "slice2",
      image: sliceOfBread,
      position: { x: 38, y: 76 },
      size: { width: 20, height: 20 },
      isDraggable: true,
      isDropTarget: true,
      hidden: true,
    },
    workspace: {
      id: "workspace",
      image: "",
      position: { x: 30, y: 78 },
      size: { width: 58, height: 28 },
      isDropTarget: true,
    },
    pan: {
      id: "pan",
      image: pan,
      position: { x: 62.5, y: 70 },
      size: { width: 45, height: 28 },
    },
    "pan-food": {
      id: "pan-food",
      image: "",
      position: { x: 62.5, y: 70 },
      size: { width: 45, height: 28 },
      isDropTarget: true,
    },
    "cheese-pile": {
      id: "cheese-pile",
      image: cheesePile,
      position: { x: 37, y: 50 },
      size: { width: 22, height: 16 },
      isDraggable: true,
    },
    spatula: {
      id: "spatula",
      image: spatula,
      position: { x: 94, y: 70 },
      size: { width: 12, height: 35 },
      isDraggable: true,
      hidden: true,
    },
    "stove-button": {
      id: "stove-button",
      image: "",
      position: { x: 70, y: 82 },
      size: { width: 55, height: 28 },
    },
    "finished-dish": {
      id: "finished-dish",
      image: "",
      position: { x: 50, y: 55 },
      size: { width: 35, height: 35 },
    },
  },
  initialVisibleObjects: [
    "bg", "bread-loaf", "butter-stick", "workspace", "pan", "pan-food", "cheese-pile", "stove-button", "finished-dish",
  ],
};

export default grilledCheeseRecipe;
