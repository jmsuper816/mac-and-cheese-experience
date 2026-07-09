export interface RecipeStep {
  instruction: string;
  itemId: string;
  itemEmoji: string;
  itemLabel: string;
}

export interface RecipePuzzle {
  recipeName: string;
  emoji: string;
  steps: RecipeStep[];
  allItems: { id: string; emoji: string; label: string }[];
  correctOrder: string[];
  shuffledSteps: string[];
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Tier 1: Simple 3-step recipes
const tier1Recipes = [
  {
    name: "Peanut Butter Sandwich",
    emoji: "🥪",
    steps: [
      { instruction: "Get two slices of bread", itemId: "bread", itemEmoji: "🍞", itemLabel: "Bread" },
      { instruction: "Spread peanut butter on one slice", itemId: "peanut-butter", itemEmoji: "🥜", itemLabel: "Peanut Butter" },
      { instruction: "Put the slices together", itemId: "hands", itemEmoji: "👐", itemLabel: "Press Together" }
    ]
  },
  {
    name: "Fruit Salad",
    emoji: "🥗",
    steps: [
      { instruction: "Wash the fruits", itemId: "sink", itemEmoji: "🚿", itemLabel: "Sink" },
      { instruction: "Cut fruits into pieces", itemId: "knife", itemEmoji: "🔪", itemLabel: "Knife" },
      { instruction: "Mix in a bowl", itemId: "bowl", itemEmoji: "🥣", itemLabel: "Bowl" }
    ]
  },
  {
    name: "Cereal Bowl",
    emoji: "🥣",
    steps: [
      { instruction: "Pour cereal into bowl", itemId: "cereal", itemEmoji: "🥣", itemLabel: "Cereal Box" },
      { instruction: "Add milk", itemId: "milk", itemEmoji: "🥛", itemLabel: "Milk" },
      { instruction: "Add a spoon and enjoy", itemId: "spoon", itemEmoji: "🥄", itemLabel: "Spoon" }
    ]
  },
  {
    name: "Toast with Jam",
    emoji: "🍞",
    steps: [
      { instruction: "Put bread in toaster", itemId: "toaster", itemEmoji: "🍞", itemLabel: "Toaster" },
      { instruction: "Wait for toast to pop up", itemId: "timer", itemEmoji: "⏰", itemLabel: "Wait" },
      { instruction: "Spread jam on toast", itemId: "jam", itemEmoji: "🍓", itemLabel: "Jam" }
    ]
  },
  {
    name: "Cheese Crackers",
    emoji: "🧀",
    steps: [
      { instruction: "Get crackers from box", itemId: "crackers", itemEmoji: "🍘", itemLabel: "Crackers" },
      { instruction: "Put cheese slice on cracker", itemId: "cheese", itemEmoji: "🧀", itemLabel: "Cheese" },
      { instruction: "Add another cracker on top", itemId: "crackers2", itemEmoji: "🍘", itemLabel: "Top Cracker" }
    ]
  },
  {
    name: "Apple Slices",
    emoji: "🍎",
    steps: [
      { instruction: "Wash the apple", itemId: "sink", itemEmoji: "🚿", itemLabel: "Sink" },
      { instruction: "Cut apple into slices", itemId: "knife", itemEmoji: "🔪", itemLabel: "Knife" },
      { instruction: "Arrange on a plate", itemId: "plate", itemEmoji: "🍽️", itemLabel: "Plate" }
    ]
  },
  {
    name: "Yogurt Parfait",
    emoji: "🍨",
    steps: [
      { instruction: "Put yogurt in a cup", itemId: "yogurt", itemEmoji: "🥛", itemLabel: "Yogurt" },
      { instruction: "Add granola on top", itemId: "granola", itemEmoji: "🌾", itemLabel: "Granola" },
      { instruction: "Add berries", itemId: "berries", itemEmoji: "🍓", itemLabel: "Berries" }
    ]
  },
  {
    name: "Banana Bites",
    emoji: "🍌",
    steps: [
      { instruction: "Peel the banana", itemId: "hands", itemEmoji: "👐", itemLabel: "Peel" },
      { instruction: "Slice banana into rounds", itemId: "knife", itemEmoji: "🔪", itemLabel: "Knife" },
      { instruction: "Arrange on plate", itemId: "plate", itemEmoji: "🍽️", itemLabel: "Plate" }
    ]
  },
];

// Tier 2: 4-5 step recipes
const tier2Recipes = [
  {
    name: "Grilled Cheese",
    emoji: "🥪",
    steps: [
      { instruction: "Butter two slices of bread", itemId: "butter", itemEmoji: "🧈", itemLabel: "Butter" },
      { instruction: "Put cheese between bread slices", itemId: "cheese", itemEmoji: "🧀", itemLabel: "Cheese" },
      { instruction: "Heat pan on stove", itemId: "stove", itemEmoji: "🔥", itemLabel: "Stove" },
      { instruction: "Cook sandwich until golden", itemId: "spatula", itemEmoji: "🍳", itemLabel: "Cook" },
      { instruction: "Flip and cook other side", itemId: "flip", itemEmoji: "🔄", itemLabel: "Flip" }
    ]
  },
  {
    name: "Scrambled Eggs",
    emoji: "🍳",
    steps: [
      { instruction: "Crack eggs into bowl", itemId: "eggs", itemEmoji: "🥚", itemLabel: "Eggs" },
      { instruction: "Beat eggs with fork", itemId: "fork", itemEmoji: "🍴", itemLabel: "Fork" },
      { instruction: "Heat pan with butter", itemId: "pan", itemEmoji: "🍳", itemLabel: "Pan" },
      { instruction: "Pour eggs into pan", itemId: "pour", itemEmoji: "🫗", itemLabel: "Pour" },
      { instruction: "Stir until cooked", itemId: "spatula", itemEmoji: "🥄", itemLabel: "Stir" }
    ]
  },
  {
    name: "Smoothie",
    emoji: "🥤",
    steps: [
      { instruction: "Add fruits to blender", itemId: "fruits", itemEmoji: "🍓", itemLabel: "Fruits" },
      { instruction: "Pour in milk or juice", itemId: "milk", itemEmoji: "🥛", itemLabel: "Milk" },
      { instruction: "Add ice cubes", itemId: "ice", itemEmoji: "🧊", itemLabel: "Ice" },
      { instruction: "Blend until smooth", itemId: "blender", itemEmoji: "🔀", itemLabel: "Blender" },
      { instruction: "Pour into glass", itemId: "glass", itemEmoji: "🥤", itemLabel: "Glass" }
    ]
  },
  {
    name: "Pasta",
    emoji: "🍝",
    steps: [
      { instruction: "Boil water in pot", itemId: "pot", itemEmoji: "🍲", itemLabel: "Pot" },
      { instruction: "Add pasta to boiling water", itemId: "pasta", itemEmoji: "🍝", itemLabel: "Pasta" },
      { instruction: "Cook for 8-10 minutes", itemId: "timer", itemEmoji: "⏰", itemLabel: "Timer" },
      { instruction: "Drain the pasta", itemId: "colander", itemEmoji: "🥣", itemLabel: "Drain" },
      { instruction: "Add sauce and mix", itemId: "sauce", itemEmoji: "🥫", itemLabel: "Sauce" }
    ]
  },
  {
    name: "Quesadilla",
    emoji: "🌮",
    steps: [
      { instruction: "Place tortilla in pan", itemId: "tortilla", itemEmoji: "🫓", itemLabel: "Tortilla" },
      { instruction: "Sprinkle cheese on half", itemId: "cheese", itemEmoji: "🧀", itemLabel: "Cheese" },
      { instruction: "Fold tortilla in half", itemId: "fold", itemEmoji: "📁", itemLabel: "Fold" },
      { instruction: "Cook until cheese melts", itemId: "stove", itemEmoji: "🔥", itemLabel: "Cook" },
      { instruction: "Cut into triangles", itemId: "knife", itemEmoji: "🔪", itemLabel: "Cut" }
    ]
  },
  {
    name: "French Toast",
    emoji: "🍞",
    steps: [
      { instruction: "Beat eggs and milk in bowl", itemId: "bowl", itemEmoji: "🥣", itemLabel: "Bowl" },
      { instruction: "Dip bread in egg mixture", itemId: "bread", itemEmoji: "🍞", itemLabel: "Bread" },
      { instruction: "Heat pan with butter", itemId: "pan", itemEmoji: "🍳", itemLabel: "Pan" },
      { instruction: "Cook bread until golden", itemId: "cook", itemEmoji: "🔥", itemLabel: "Cook" },
      { instruction: "Flip and cook other side", itemId: "flip", itemEmoji: "🔄", itemLabel: "Flip" }
    ]
  },
  {
    name: "Veggie Wrap",
    emoji: "🌯",
    steps: [
      { instruction: "Lay tortilla flat", itemId: "tortilla", itemEmoji: "🫓", itemLabel: "Tortilla" },
      { instruction: "Spread hummus on tortilla", itemId: "hummus", itemEmoji: "🥜", itemLabel: "Hummus" },
      { instruction: "Add chopped veggies", itemId: "veggies", itemEmoji: "🥬", itemLabel: "Veggies" },
      { instruction: "Roll up tightly", itemId: "roll", itemEmoji: "🌯", itemLabel: "Roll" },
      { instruction: "Cut in half", itemId: "knife", itemEmoji: "🔪", itemLabel: "Cut" }
    ]
  },
  {
    name: "Mac and Cheese",
    emoji: "🧀",
    steps: [
      { instruction: "Boil water and cook pasta", itemId: "pot", itemEmoji: "🍲", itemLabel: "Pot" },
      { instruction: "Drain pasta", itemId: "colander", itemEmoji: "🥣", itemLabel: "Drain" },
      { instruction: "Add milk and butter", itemId: "milk", itemEmoji: "🥛", itemLabel: "Milk" },
      { instruction: "Stir in cheese powder", itemId: "cheese", itemEmoji: "🧀", itemLabel: "Cheese" },
      { instruction: "Mix until creamy", itemId: "spoon", itemEmoji: "🥄", itemLabel: "Mix" }
    ]
  },
];

// Tier 3: Complex 5-6 step recipes
const tier3Recipes = [
  {
    name: "Mini Pizzas",
    emoji: "🍕",
    steps: [
      { instruction: "Preheat oven to 375°F", itemId: "oven", itemEmoji: "🔥", itemLabel: "Oven" },
      { instruction: "Split English muffins in half", itemId: "muffins", itemEmoji: "🍞", itemLabel: "Muffins" },
      { instruction: "Spread sauce on each half", itemId: "sauce", itemEmoji: "🥫", itemLabel: "Sauce" },
      { instruction: "Sprinkle cheese on top", itemId: "cheese", itemEmoji: "🧀", itemLabel: "Cheese" },
      { instruction: "Add your favorite toppings", itemId: "toppings", itemEmoji: "🍄", itemLabel: "Toppings" },
      { instruction: "Bake for 10-12 minutes", itemId: "timer", itemEmoji: "⏰", itemLabel: "Bake" }
    ]
  },
  {
    name: "Chicken Nuggets",
    emoji: "🍗",
    steps: [
      { instruction: "Preheat oven to 400°F", itemId: "oven", itemEmoji: "🔥", itemLabel: "Oven" },
      { instruction: "Line baking sheet with foil", itemId: "foil", itemEmoji: "📄", itemLabel: "Foil" },
      { instruction: "Place nuggets on sheet", itemId: "nuggets", itemEmoji: "🍗", itemLabel: "Nuggets" },
      { instruction: "Bake for 10 minutes", itemId: "timer", itemEmoji: "⏰", itemLabel: "Timer" },
      { instruction: "Flip nuggets over", itemId: "flip", itemEmoji: "🔄", itemLabel: "Flip" },
      { instruction: "Bake 5 more minutes until crispy", itemId: "bake", itemEmoji: "✨", itemLabel: "Finish" }
    ]
  },
  {
    name: "Tacos",
    emoji: "🌮",
    steps: [
      { instruction: "Brown ground meat in pan", itemId: "meat", itemEmoji: "🥩", itemLabel: "Meat" },
      { instruction: "Add taco seasoning and water", itemId: "seasoning", itemEmoji: "🧂", itemLabel: "Seasoning" },
      { instruction: "Simmer until thickened", itemId: "simmer", itemEmoji: "🔥", itemLabel: "Simmer" },
      { instruction: "Warm taco shells in oven", itemId: "shells", itemEmoji: "🌮", itemLabel: "Shells" },
      { instruction: "Fill shells with meat", itemId: "fill", itemEmoji: "🥄", itemLabel: "Fill" },
      { instruction: "Top with cheese, lettuce, and tomatoes", itemId: "toppings", itemEmoji: "🥬", itemLabel: "Toppings" }
    ]
  },
  {
    name: "Pancakes",
    emoji: "🥞",
    steps: [
      { instruction: "Mix flour, eggs, milk in bowl", itemId: "bowl", itemEmoji: "🥣", itemLabel: "Bowl" },
      { instruction: "Whisk until smooth batter", itemId: "whisk", itemEmoji: "🥢", itemLabel: "Whisk" },
      { instruction: "Heat griddle or pan", itemId: "griddle", itemEmoji: "🍳", itemLabel: "Griddle" },
      { instruction: "Pour batter to make circles", itemId: "pour", itemEmoji: "🫗", itemLabel: "Pour" },
      { instruction: "Wait for bubbles to form", itemId: "wait", itemEmoji: "💭", itemLabel: "Wait" },
      { instruction: "Flip and cook until golden", itemId: "flip", itemEmoji: "🔄", itemLabel: "Flip" }
    ]
  },
  {
    name: "Baked Potato",
    emoji: "🥔",
    steps: [
      { instruction: "Wash and dry potato", itemId: "sink", itemEmoji: "🚿", itemLabel: "Wash" },
      { instruction: "Poke holes with fork", itemId: "fork", itemEmoji: "🍴", itemLabel: "Fork" },
      { instruction: "Rub with oil and salt", itemId: "oil", itemEmoji: "🫒", itemLabel: "Oil" },
      { instruction: "Wrap in foil", itemId: "foil", itemEmoji: "📄", itemLabel: "Foil" },
      { instruction: "Bake at 400°F for 45 minutes", itemId: "oven", itemEmoji: "🔥", itemLabel: "Bake" },
      { instruction: "Add toppings and serve", itemId: "toppings", itemEmoji: "🧈", itemLabel: "Toppings" }
    ]
  },
  {
    name: "Fried Rice",
    emoji: "🍚",
    steps: [
      { instruction: "Cook rice and let cool", itemId: "rice", itemEmoji: "🍚", itemLabel: "Rice" },
      { instruction: "Heat oil in wok or pan", itemId: "wok", itemEmoji: "🍳", itemLabel: "Wok" },
      { instruction: "Scramble eggs and set aside", itemId: "eggs", itemEmoji: "🥚", itemLabel: "Eggs" },
      { instruction: "Stir-fry veggies until tender", itemId: "veggies", itemEmoji: "🥕", itemLabel: "Veggies" },
      { instruction: "Add rice and soy sauce", itemId: "soy", itemEmoji: "🥢", itemLabel: "Soy Sauce" },
      { instruction: "Mix in eggs and serve hot", itemId: "serve", itemEmoji: "🍽️", itemLabel: "Serve" }
    ]
  },
  {
    name: "Meatballs",
    emoji: "🍝",
    steps: [
      { instruction: "Mix meat, breadcrumbs, and egg", itemId: "bowl", itemEmoji: "🥣", itemLabel: "Mix" },
      { instruction: "Add seasonings and mix well", itemId: "seasoning", itemEmoji: "🧂", itemLabel: "Season" },
      { instruction: "Roll mixture into balls", itemId: "hands", itemEmoji: "👐", itemLabel: "Roll" },
      { instruction: "Brown meatballs in pan", itemId: "pan", itemEmoji: "🍳", itemLabel: "Brown" },
      { instruction: "Add sauce to pan", itemId: "sauce", itemEmoji: "🥫", itemLabel: "Sauce" },
      { instruction: "Simmer for 15-20 minutes", itemId: "simmer", itemEmoji: "🔥", itemLabel: "Simmer" }
    ]
  },
  {
    name: "Veggie Stir-Fry",
    emoji: "🥘",
    steps: [
      { instruction: "Chop all vegetables", itemId: "knife", itemEmoji: "🔪", itemLabel: "Chop" },
      { instruction: "Heat oil in wok on high", itemId: "wok", itemEmoji: "🍳", itemLabel: "Wok" },
      { instruction: "Add hard veggies first", itemId: "carrots", itemEmoji: "🥕", itemLabel: "Carrots" },
      { instruction: "Stir-fry for 3 minutes", itemId: "stir", itemEmoji: "🥄", itemLabel: "Stir" },
      { instruction: "Add soft veggies and sauce", itemId: "sauce", itemEmoji: "🥫", itemLabel: "Sauce" },
      { instruction: "Cook until tender-crisp", itemId: "serve", itemEmoji: "🍽️", itemLabel: "Serve" }
    ]
  },
];

const generateRecipeFromData = (recipe: { name: string; emoji: string; steps: RecipeStep[] }): RecipePuzzle => {
  const allItems = recipe.steps.map(step => ({
    id: step.itemId,
    emoji: step.itemEmoji,
    label: step.itemLabel
  }));
  
  return {
    recipeName: recipe.name,
    emoji: recipe.emoji,
    steps: recipe.steps,
    allItems: shuffleArray(allItems),
    correctOrder: recipe.steps.map(s => s.instruction),
    shuffledSteps: shuffleArray(recipe.steps.map(s => s.instruction)),
  };
};

const generateTier1Recipe = (excludeUsed: string[] = []): RecipePuzzle => {
  const availableRecipes = tier1Recipes.filter(r => !excludeUsed.includes(r.name));
  const recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
  return generateRecipeFromData(recipe);
};

const generateTier2Recipe = (excludeUsed: string[] = []): RecipePuzzle => {
  const availableRecipes = tier2Recipes.filter(r => !excludeUsed.includes(r.name));
  const recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
  return generateRecipeFromData(recipe);
};

const generateTier3Recipe = (excludeUsed: string[] = []): RecipePuzzle => {
  const availableRecipes = tier3Recipes.filter(r => !excludeUsed.includes(r.name));
  const recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
  return generateRecipeFromData(recipe);
};

export const generateRecipe = (tier: number, excludeUsed: string[] = []): RecipePuzzle => {
  switch (tier) {
    case 1:
      return generateTier1Recipe(excludeUsed);
    case 2:
      return generateTier2Recipe(excludeUsed);
    case 3:
      return generateTier3Recipe(excludeUsed);
    default:
      return generateTier1Recipe(excludeUsed);
  }
};
