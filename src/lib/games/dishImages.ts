// Finished dish image imports
import peanutButterSandwich from "@/assets/kitchen/dishes/peanut-butter-sandwich.png";
import fruitSalad from "@/assets/kitchen/dishes/fruit-salad.png";
import cerealBowl from "@/assets/kitchen/dishes/cereal-bowl.png";
import toastWithJam from "@/assets/kitchen/dishes/toast-with-jam.png";
import cheeseCrackers from "@/assets/kitchen/dishes/cheese-crackers.png";
import appleSlices from "@/assets/kitchen/dishes/apple-slices.png";
import yogurtParfait from "@/assets/kitchen/dishes/yogurt-parfait.png";
import bananaBites from "@/assets/kitchen/dishes/banana-bites.png";
import grilledCheese from "@/assets/kitchen/dishes/grilled-cheese.png";
import scrambledEggs from "@/assets/kitchen/dishes/scrambled-eggs.png";
import smoothie from "@/assets/kitchen/dishes/smoothie.png";
import pastaDish from "@/assets/kitchen/dishes/pasta-dish.png";
import quesadilla from "@/assets/kitchen/dishes/quesadilla.png";
import frenchToast from "@/assets/kitchen/dishes/french-toast.png";
import veggieWrap from "@/assets/kitchen/dishes/veggie-wrap.png";
import macAndCheese from "@/assets/kitchen/dishes/mac-and-cheese.png";
import miniPizzas from "@/assets/kitchen/dishes/mini-pizzas.png";
import chickenNuggets from "@/assets/kitchen/dishes/chicken-nuggets.png";
import tacos from "@/assets/kitchen/dishes/tacos.png";
import pancakes from "@/assets/kitchen/dishes/pancakes.png";
import bakedPotato from "@/assets/kitchen/dishes/baked-potato.png";
import friedRice from "@/assets/kitchen/dishes/fried-rice.png";
import meatballs from "@/assets/kitchen/dishes/meatballs.png";
import veggieStirFry from "@/assets/kitchen/dishes/veggie-stir-fry.png";

// Map recipe names to their finished dish images
export const dishImages: Record<string, string> = {
  "Peanut Butter Sandwich": peanutButterSandwich,
  "Fruit Salad": fruitSalad,
  "Cereal Bowl": cerealBowl,
  "Toast with Jam": toastWithJam,
  "Cheese Crackers": cheeseCrackers,
  "Apple Slices": appleSlices,
  "Yogurt Parfait": yogurtParfait,
  "Banana Bites": bananaBites,
  "Grilled Cheese": grilledCheese,
  "Scrambled Eggs": scrambledEggs,
  "Smoothie": smoothie,
  "Pasta": pastaDish,
  "Quesadilla": quesadilla,
  "French Toast": frenchToast,
  "Veggie Wrap": veggieWrap,
  "Mac and Cheese": macAndCheese,
  "Mini Pizzas": miniPizzas,
  "Chicken Nuggets": chickenNuggets,
  "Tacos": tacos,
  "Pancakes": pancakes,
  "Baked Potato": bakedPotato,
  "Fried Rice": friedRice,
  "Meatballs": meatballs,
  "Veggie Stir-Fry": veggieStirFry,
};

// Get finished dish image for a recipe name
export const getDishImage = (recipeName: string): string | undefined => {
  return dishImages[recipeName];
};
