// Jelly Toast recipe — all custom assets
import breadLoaf from "@/assets/kitchen/jelly-toast/bread-loaf.png";
import sliceOfBread from "@/assets/kitchen/pb-sandwich/slice-of-bread.webp";
import toaster from "@/assets/kitchen/jelly-toast/toaster.webp";
import toasterBread1 from "@/assets/kitchen/jelly-toast/toaster-bread1.webp";
import toasterBread2 from "@/assets/kitchen/jelly-toast/toaster-bread2.webp";
import toasterToasting from "@/assets/kitchen/jelly-toast/toaster-toasting.webp";
import toasterToast1 from "@/assets/kitchen/jelly-toast/toaster-toast1.webp";
import toasterToast2 from "@/assets/kitchen/jelly-toast/toaster-toast2.webp";
import jellyJar from "@/assets/kitchen/jelly-toast/jelly-jar.webp";
import jellyJarNoLid from "@/assets/kitchen/jelly-toast/jelly-jar-no-lid.webp";
import jellyJarNoLid2 from "@/assets/kitchen/jelly-toast/jelly-jar-no-lid2.webp";
import toastedBread from "@/assets/kitchen/jelly-toast/toasted-bread.webp";
import toastedBreadJelly from "@/assets/kitchen/jelly-toast/toasted-bread-jelly.webp";
import timerImg from "@/assets/kitchen/grilled-cheese/timer.webp";
import { RecipeData } from "./recipeTypes";

const jellyToastRecipe: RecipeData = {
  id: "jelly-toast",
  name: "Toast with Jelly",
  emoji: "🍇",
  tier: 1,
  finishedImage: toastedBreadJelly,
  steps: [
    // Step 1: Put bread in the toaster
    {
      instruction: "Put bread in the toaster.",
      action: "drag",
      icon: sliceOfBread,
      dragItem: { id: "bread-loaf", image: breadLoaf, label: "Bread", dragImage: sliceOfBread },
      dropTarget: "toaster",
      sceneChanges: {
        toaster: toasterBread1,
      },
    },
    // Step 2: Put another slice in the toaster
    {
      instruction: "Put another slice of bread in the toaster.",
      action: "drag",
      icon: sliceOfBread,
      dragItem: { id: "bread-loaf", image: breadLoaf, label: "Bread", dragImage: sliceOfBread },
      dropTarget: "toaster",
      sceneChanges: {
        toaster: toasterBread2,
      },
    },
    // Step 3: Push knob down to toast
    {
      instruction: "Push knob down to toast.",
      action: "tap",
      icon: toasterBread2,
      tapTarget: "toaster",
      sceneChanges: {
        toaster: toasterToasting,
      },
    },
    // Step 4: Wait for toasting
    {
      instruction: "Wait!",
      action: "wait",
      icon: timerImg,
      waitDuration: 3000,
      waitImage: timerImg,
      sceneChanges: {
        toaster: toasterToast2,
      },
    },
    // Step 5: Take toast out of toaster
    {
      instruction: "Take toast out of toaster.",
      action: "drag",
      icon: toastedBread,
      dragItem: { id: "toaster", image: toasterToast2, label: "Toast", dragImage: toastedBread },
      dropTarget: "workspace1",
      alternativeDropTargets: [{ id: "workspace2", sceneChanges: { workspace2: toastedBread, toaster: toasterToast1 } }],
      sceneChanges: {
        workspace1: toastedBread,
        toaster: toasterToast1,
      },
    },
    // Step 6: Take other toast out of toaster
    {
      instruction: "Take other toast out of toaster.",
      action: "drag",
      icon: toastedBread,
      dragItem: { id: "toaster", image: toasterToast1, label: "Toast", dragImage: toastedBread },
      dropTarget: "workspace2",
      alternativeDropTargets: [{ id: "workspace1", sceneChanges: { workspace1: toastedBread, toaster: toaster } }],
      sceneChanges: {
        workspace2: toastedBread,
        toaster: toaster,
      },
    },
    // Step 7: Take the lid off the jelly jar
    {
      instruction: "Take the lid off the jelly jar.",
      action: "tap",
      icon: jellyJar,
      tapTarget: "jelly-jar",
      sceneChanges: {
        "jelly-jar": jellyJarNoLid,
      },
    },
    // Step 8: Spread jelly on toast (either toast first)
    {
      instruction: "Spread jelly on toast.",
      action: "drag",
      icon: jellyJarNoLid,
      dragItem: { id: "jelly-jar", image: jellyJarNoLid, label: "Jelly", dragImage: jellyJarNoLid2 },
      dropTarget: "workspace1",
      alternativeDropTargets: [{ id: "workspace2", sceneChanges: { workspace2: toastedBreadJelly } }],
      sceneChanges: {
        workspace1: toastedBreadJelly,
      },
    },
    // Step 9: Spread jelly on other toast (either toast)
    {
      instruction: "Spread jelly on toast.",
      action: "drag",
      icon: jellyJarNoLid,
      dragItem: { id: "jelly-jar", image: jellyJarNoLid, label: "Jelly", dragImage: jellyJarNoLid2 },
      dropTarget: "workspace2",
      alternativeDropTargets: [{ id: "workspace1", sceneChanges: { workspace1: toastedBreadJelly } }],
      sceneChanges: {
        workspace2: toastedBreadJelly,
      },
    },
  ],
  easterEggs: [
    {
      objectId: "jelly-jar",
      condition: "success",
      matchImage: jellyJarNoLid,
      sceneChanges: { "jelly-jar": jellyJar },
      toastMessage: "🍇 You closed the jar!",
      splatEffect: true,
    },
  ],
  sceneObjects: {
    toaster: {
      id: "toaster",
      image: toaster,
      position: { x: 78, y: 48 },
      size: { width: 44, height: 44 },
      isDraggable: true,
      isDropTarget: true,
    },
    "bread-loaf": {
      id: "bread-loaf",
      image: breadLoaf,
      position: { x: 15, y: 52 },
      size: { width: 34, height: 39 },
      isDraggable: true,
    },
    "jelly-jar": {
      id: "jelly-jar",
      image: jellyJar,
      position: { x: 46, y: 46 },
      size: { width: 22, height: 42 },
      isDraggable: true,
    },
    workspace1: {
      id: "workspace1",
      image: "",
      position: { x: 30, y: 76 },
      size: { width: 26, height: 22 },
      isDropTarget: true,
    },
    workspace2: {
      id: "workspace2",
      image: "",
      position: { x: 62, y: 76 },
      size: { width: 26, height: 22 },
      isDropTarget: true,
    },
  },
  initialVisibleObjects: ["toaster", "bread-loaf", "jelly-jar", "workspace1", "workspace2"],
};

export default jellyToastRecipe;
