// Smoothie recipe - image assets
import raspberries from "@/assets/kitchen/smoothie/raspberries.webp";
import strawberries from "@/assets/kitchen/smoothie/strawberries.webp";
import blueberries from "@/assets/kitchen/smoothie/blueberries.webp";
import iceBowl from "@/assets/kitchen/smoothie/ice-bowl.webp";
import iceCubes from "@/assets/kitchen/smoothie/ice-cubes.webp";
import milkJug from "@/assets/kitchen/smoothie/milk-jug.png";
import straw from "@/assets/kitchen/smoothie/straw.webp";
import mainBlender from "@/assets/kitchen/smoothie/main-blender.webp";
import blenderBerries1 from "@/assets/kitchen/smoothie/blender-berries1.webp";
import blenderBerries2 from "@/assets/kitchen/smoothie/blender-berries2.webp";
import blenderBerries3 from "@/assets/kitchen/smoothie/blender-berries3.webp";
import blenderWithMilk from "@/assets/kitchen/smoothie/blender-with-milk.webp";
import blenderWithIce from "@/assets/kitchen/smoothie/blender-with-ice.webp";
import blenderMixing from "@/assets/kitchen/smoothie/blender-mixing.webp";
import blenderBlended from "@/assets/kitchen/smoothie/blender-blended.webp";
import blenderTop from "@/assets/kitchen/smoothie/blender-top.webp";
import blenderBase from "@/assets/kitchen/smoothie/blender-base.webp";
import emptyGlass from "@/assets/kitchen/smoothie/empty-glass.webp";
import smoothieGlass from "@/assets/kitchen/smoothie/smoothie-glass.webp";
import smoothieGlassStraw from "@/assets/kitchen/smoothie/smoothie-glass-straw.webp";
import { RecipeData } from "./recipeTypes";

const smoothieRecipe: RecipeData = {
  id: "smoothie",
  name: "Smoothie",
  emoji: "🥤",
  tier: 2,
  finishedImage: smoothieGlassStraw,
  steps: [
    {
      instruction: "Add raspberries.",
      action: "drag",
      icon: raspberries,
      dragItem: { id: "raspberries", image: raspberries, label: "Raspberries" },
      dropTarget: "blender",
      sceneChanges: {
        blender: blenderBerries1,
      },
      hideAfterDrop: ["raspberries"],
    },
    {
      instruction: "Add strawberries.",
      action: "drag",
      icon: strawberries,
      dragItem: { id: "strawberries", image: strawberries, label: "Strawberries" },
      dropTarget: "blender",
      sceneChanges: {
        blender: blenderBerries2,
      },
      hideAfterDrop: ["strawberries"],
    },
    {
      instruction: "Add blueberries.",
      action: "drag",
      icon: blueberries,
      dragItem: { id: "blueberries", image: blueberries, label: "Blueberries" },
      dropTarget: "blender",
      sceneChanges: {
        blender: blenderBerries3,
      },
      hideAfterDrop: ["blueberries"],
    },
    {
      instruction: "Pour in the milk.",
      action: "drag",
      icon: milkJug,
      dragItem: { id: "milk-jug", image: milkJug, label: "Milk" },
      dropTarget: "blender",
      sceneChanges: {
        blender: blenderWithMilk,
      },
      hideAfterDrop: ["milk-jug"],
    },
    {
      instruction: "Add the ice cubes.",
      action: "drag",
      icon: iceCubes,
      dragItem: { id: "ice-bowl", image: iceBowl, label: "Ice", dragImage: iceCubes },
      dropTarget: "blender",
      sceneChanges: {
        blender: blenderWithIce,
      },
      hideAfterDrop: ["ice-bowl"],
    },
    {
      instruction: "Blend!",
      action: "tap",
      icon: mainBlender,
      tapTarget: "blender-button",
      sceneChanges: {
        blender: blenderBlended,
      },
      animationDuring: {
        target: "blender",
        image: blenderMixing,
        duration: 1500,
        className: "animate-pulse",
      },
    },
    {
      instruction: "Pour into glass.",
      action: "drag",
      icon: blenderTop,
      dragItem: { id: "blender", image: blenderTop, label: "Blender", dragImage: blenderTop },
      dropTarget: "glass",
      sceneChanges: {
        blender: blenderBase,
        glass: smoothieGlass,
      },
      showOnStep: ["glass"],
    },
    {
      instruction: "Add straw.",
      action: "drag",
      icon: straw,
      dragItem: { id: "straw", image: straw, label: "Straw" },
      dropTarget: "glass",
      showOnStep: ["straw"],
      hideOnStep: ["blender"],
      sceneChanges: {
        glass: smoothieGlassStraw,
      },
      objectPositionChanges: {
        glass: { x: 50, y: 50 },
      },
      objectSizeChanges: {
        glass: { width: 50, height: 85 },
      },
      hideAfterDrop: ["straw"],
    },
  ],
  // Scene objects define what's visible on the counter and their positions
  // Positions are percentages relative to the play area
  sceneObjects: {
    blender: {
      id: "blender",
      image: mainBlender,
      position: { x: 50, y: 55 },
      size: { width: 42, height: 72 },
      isDropTarget: true,
    },
    raspberries: {
      id: "raspberries",
      image: raspberries,
      position: { x: 90, y: 63 },
      size: { width: 26, height: 24 },
      isDraggable: true,
    },
    strawberries: {
      id: "strawberries",
      image: strawberries,
      position: { x: 73, y: 74 },
      size: { width: 26, height: 24 },
      isDraggable: true,
    },
    blueberries: {
      id: "blueberries",
      image: blueberries,
      position: { x: 18, y: 77 },
      size: { width: 24, height: 24 },
      isDraggable: true,
    },
    "milk-jug": {
      id: "milk-jug",
      image: milkJug,
      position: { x: 76, y: 45 },
      size: { width: 22, height: 45 },
      isDraggable: true,
    },
    "ice-bowl": {
      id: "ice-bowl",
      image: iceBowl,
      position: { x: 16, y: 55 },
      size: { width: 22, height: 22 },
      isDraggable: true,
    },
    // blender-base and blender-top are no longer separate scene objects
    // The blender object swaps its image to blenderBase after pouring
    glass: {
      id: "glass",
      image: emptyGlass,
      position: { x: 72, y: 55 },
      size: { width: 30, height: 55 },
      isDropTarget: true,
      hidden: true,
    },
    straw: {
      id: "straw",
      image: straw,
      position: { x: 88, y: 55 },
      size: { width: 18, height: 36 },
      isDraggable: true,
      hidden: true,
    },
  },
  // Which scene objects are visible at step 0 (before any actions)
  initialVisibleObjects: ["blender", "raspberries", "strawberries", "blueberries", "milk-jug", "ice-bowl"],
};

export default smoothieRecipe;
