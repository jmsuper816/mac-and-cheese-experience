import kitchenBg from "@/assets/kitchen/cheese-crackers/kitchen-bg.png";
import crackerPile from "@/assets/kitchen/cheese-crackers/cracker-pile.webp";
import singleCracker from "@/assets/kitchen/cheese-crackers/single-cracker.webp";
import cheesePile from "@/assets/kitchen/cheese-crackers/cheese-pile.webp";
import singleCheese from "@/assets/kitchen/cheese-crackers/single-cheese.webp";
import crackerWithCheese from "@/assets/kitchen/cheese-crackers/cracker-with-cheese.webp";
import crackerWithCheese2 from "@/assets/kitchen/cheese-crackers/cracker-with-cheese-2.webp";
import crackerWithCheese3 from "@/assets/kitchen/cheese-crackers/cracker-with-cheese-3.webp";
import crackerWithCheese4 from "@/assets/kitchen/cheese-crackers/cracker-with-cheese-4.webp";
import topCrackerWithCheese from "@/assets/kitchen/cheese-crackers/top-cracker-with-cheese.webp";
import topCrackerWithCheese2 from "@/assets/kitchen/cheese-crackers/top-cracker-with-cheese-2.webp";
import topCrackerWithCheese3 from "@/assets/kitchen/cheese-crackers/top-cracker-with-cheese-3.webp";
import topCrackerWithCheese4 from "@/assets/kitchen/cheese-crackers/top-cracker-with-cheese-4.webp";
import discoScene from "@/assets/kitchen/cheese-crackers/disco-scene.webp";
import cheeseMan from "@/assets/kitchen/cheese-crackers/cheese-man.webp";
import finishedDish from "@/assets/kitchen/dishes/cheese-crackers.png";
import { RecipeData, RecipeStep } from "./recipeTypes";

// 6 cracker spots arranged in 2 rows of 3
const SPOTS = [
  { id: "spot1", x: 35, y: 65 },
  { id: "spot2", x: 50, y: 65 },
  { id: "spot3", x: 65, y: 65 },
  { id: "spot4", x: 35, y: 76 },
  { id: "spot5", x: 50, y: 76 },
  { id: "spot6", x: 65, y: 76 },
];
const SPOT_IDS = SPOTS.map((s) => s.id);

// "Random-looking" order in which spots get populated
const CRACKER_ORDER = ["spot4", "spot2", "spot6", "spot1", "spot5", "spot3"];

// Cheese variants cycle: 1, 2, 3, 4, 3, 2
const CHEESE_VARIANTS = [
  crackerWithCheese,
  crackerWithCheese2,
  crackerWithCheese3,
  crackerWithCheese4,
  crackerWithCheese3,
  crackerWithCheese2,
];

const SPOT_SIZE = { width: 15, height: 12 };

// ── Cracker steps (1-6): drag cracker → play-area; each step reveals one spot ─
const crackerSteps: RecipeStep[] = CRACKER_ORDER.map((spotId, i) => ({
  instruction: `Get ${6 - i} cracker${6 - i !== 1 ? "s" : ""} from the pile.`,
  action: "drag",
  icon: singleCracker,
  dragItem: { id: "cracker-pile", image: crackerPile, label: "Crackers", dragImage: singleCracker },
  dropTarget: "play-area",
  sceneChanges: { [spotId]: singleCracker },
}));

// ── Cheese steps (7-12): any cracker spot is a valid drop target at every step ─
// On the final step, also hide the ingredient piles (keep spots visible for the easter egg).
const [primaryCheeseSpot, ...altCheeseSpots] = SPOT_IDS;

// All images that count as "already cheesed" — skip the spot if it shows any of these
const CHEESED_IMAGES = [crackerWithCheese, crackerWithCheese2, crackerWithCheese3, crackerWithCheese4];

const cheeseSteps: RecipeStep[] = CHEESE_VARIANTS.map((variant, i) => {
  return {
    instruction: "Put a cheese slice on a cracker.",
    action: "drag",
    icon: singleCheese,
    dragItem: { id: "cheese-pile", image: cheesePile, label: "Cheese", dragImage: singleCheese },
    dropTarget: primaryCheeseSpot,
    dropTargetSkipIfHasImage: CHEESED_IMAGES,
    sceneChanges: { [primaryCheeseSpot]: variant },
    alternativeDropTargets: altCheeseSpots.map((spotId) => ({
      id: spotId,
      sceneChanges: { [spotId]: variant },
      skipIfHasImage: CHEESED_IMAGES,
    })),
  };
});

// ── Scene object definitions ──────────────────────────────────────────────────
const spotObjects: Record<string, import("./recipeTypes").SceneObjectDef> = {};
SPOTS.forEach((s) => {
  spotObjects[s.id] = {
    id: s.id,
    image: "",
    position: { x: s.x, y: s.y },
    size: SPOT_SIZE,
    isDropTarget: true,
  };
});

const cheeseCrackersRecipe: RecipeData = {
  id: "cheese-crackers",
  name: "Cheese Crackers",
  emoji: "🧀",
  tier: 1,
  finishedImage: crackerWithCheese4,
  steps: [...crackerSteps, ...cheeseSteps],
  // Easter egg: tap each cracker-with-cheese to stack another cracker on top.
  // Easter egg: drag a cracker from the pile onto each cracker-with-cheese to stack a top cracker.
  // When all 6 are stacked, the disco cutscene fires!
  easterEggs: SPOT_IDS.map((spotId, i) => {
    const TOP_CRACKER_VARIANTS = [
      topCrackerWithCheese,
      topCrackerWithCheese2,
      topCrackerWithCheese3,
      topCrackerWithCheese4,
    ];
    return {
      objectId: spotId,
      condition: "success" as const,
      // Only accept the drop if the spot currently shows a cheesed cracker (not already topped)
      skipIfImages: TOP_CRACKER_VARIANTS,
      sceneChanges: { [spotId]: TOP_CRACKER_VARIANTS[i % TOP_CRACKER_VARIANTS.length] },
      toastMessage: "Stacked! 🧀",
      groupId: "stack-cracker",
      dragSourceId: "cracker-pile",
      dragImage: singleCracker,
    };
  }),
  easterEggGroupEffects: {
    "stack-cracker": {
      toastMessage: "🧀🧀🧀 Cheese Party!!!",
      cutscene: {
        dimOverlay: true,
        slideDownImage: discoScene,
        centerScaleImage: cheeseMan,
      },
    },
  },
  sceneObjects: {
    bg: {
      id: "bg",
      image: kitchenBg,
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
    },
    "cracker-pile": {
      id: "cracker-pile",
      image: crackerPile,
      position: { x: 13, y: 70 },
      size: { width: 26, height: 26 },
      isDraggable: true,
    },
    "cheese-pile": {
      id: "cheese-pile",
      image: cheesePile,
      position: { x: 87, y: 68 },
      size: { width: 26, height: 21 },
      isDraggable: true,
    },
    // Single invisible drop area used only during cracker steps
    "play-area": {
      id: "play-area",
      image: "",
      position: { x: 50, y: 75 },
      size: { width: 48, height: 36 },
      isDropTarget: true,
    },
    ...spotObjects,
  },
  initialVisibleObjects: [
    "bg",
    "cracker-pile",
    "cheese-pile",
    "play-area",
    ...SPOT_IDS,
  ],
};

export default cheeseCrackersRecipe;
