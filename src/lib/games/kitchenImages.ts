// Kitchen item image imports
import sink from "@/assets/kitchen/sink.png";
import knife from "@/assets/kitchen/knife.png";
import bowl from "@/assets/kitchen/bowl.png";
import spoon from "@/assets/kitchen/spoon.png";
import toaster from "@/assets/kitchen/toaster.png";
import timer from "@/assets/kitchen/timer.png";
import plate from "@/assets/kitchen/plate.png";
import stove from "@/assets/kitchen/stove.png";
import spatula from "@/assets/kitchen/spatula.png";
import pan from "@/assets/kitchen/pan.png";
import blender from "@/assets/kitchen/blender.png";
import glass from "@/assets/kitchen/glass.png";
import pot from "@/assets/kitchen/pot.png";
import colander from "@/assets/kitchen/colander.png";
import oven from "@/assets/kitchen/oven.png";
import foil from "@/assets/kitchen/foil.png";
import griddle from "@/assets/kitchen/griddle.png";
import whisk from "@/assets/kitchen/whisk.png";
import wok from "@/assets/kitchen/wok.png";
import fork from "@/assets/kitchen/fork.png";

// Food items
import bread from "@/assets/kitchen/bread.png";
import peanutButter from "@/assets/kitchen/peanut-butter.png";
import milk from "@/assets/kitchen/milk.png";
import cereal from "@/assets/kitchen/cereal.png";
import jam from "@/assets/kitchen/jam.png";
import crackers from "@/assets/kitchen/crackers.png";
import cheese from "@/assets/kitchen/cheese.png";
import yogurt from "@/assets/kitchen/yogurt.png";
import granola from "@/assets/kitchen/granola.png";
import berries from "@/assets/kitchen/berries.png";
import butter from "@/assets/kitchen/butter.png";
import eggs from "@/assets/kitchen/eggs.png";
import fruits from "@/assets/kitchen/fruits.png";
import ice from "@/assets/kitchen/ice.png";
import pasta from "@/assets/kitchen/pasta.png";
import sauce from "@/assets/kitchen/sauce.png";
import tortilla from "@/assets/kitchen/tortilla.png";
import hummus from "@/assets/kitchen/hummus.png";
import veggies from "@/assets/kitchen/veggies.png";
import muffins from "@/assets/kitchen/muffins.png";
import toppings from "@/assets/kitchen/toppings.png";
import nuggets from "@/assets/kitchen/nuggets.png";
import meat from "@/assets/kitchen/meat.png";
import seasoning from "@/assets/kitchen/seasoning.png";
import shells from "@/assets/kitchen/shells.png";
import oil from "@/assets/kitchen/oil.png";
import rice from "@/assets/kitchen/rice.png";
import soy from "@/assets/kitchen/soy.png";
import carrots from "@/assets/kitchen/carrots.png";

// Action icons
import hands from "@/assets/kitchen/hands.png";
import flip from "@/assets/kitchen/flip.png";
import fold from "@/assets/kitchen/fold.png";
import pour from "@/assets/kitchen/pour.png";
import cook from "@/assets/kitchen/cook.png";
import roll from "@/assets/kitchen/roll.png";
import bake from "@/assets/kitchen/bake.png";
import simmer from "@/assets/kitchen/simmer.png";
import fill from "@/assets/kitchen/fill.png";
import wait from "@/assets/kitchen/wait.png";
import stir from "@/assets/kitchen/stir.png";
import serve from "@/assets/kitchen/serve.png";

// Map item IDs to their images
export const kitchenImages: Record<string, string> = {
  // Tools
  sink,
  knife,
  bowl,
  spoon,
  toaster,
  timer,
  plate,
  stove,
  spatula,
  pan,
  blender,
  glass,
  pot,
  colander,
  oven,
  foil,
  griddle,
  whisk,
  wok,
  fork,
  
  // Foods
  bread,
  "peanut-butter": peanutButter,
  milk,
  cereal,
  jam,
  crackers,
  crackers2: crackers,
  cheese,
  yogurt,
  granola,
  berries,
  butter,
  eggs,
  fruits,
  ice,
  pasta,
  sauce,
  tortilla,
  hummus,
  veggies,
  muffins,
  toppings,
  nuggets,
  meat,
  seasoning,
  shells,
  oil,
  rice,
  soy,
  carrots,
  
  // Actions
  hands,
  flip,
  fold,
  pour,
  cook,
  roll,
  bake,
  simmer,
  fill,
  wait,
  stir,
  serve,
};

// Get image for an item ID, falls back to undefined if not found
export const getKitchenImage = (itemId: string): string | undefined => {
  return kitchenImages[itemId];
};
