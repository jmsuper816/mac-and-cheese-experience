export interface SortingPuzzle {
  food: string;
  emoji: string;
  correctCategory: string;
  categories: string[];
  explanation: string;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Tier 1: Healthy vs Not-So-Healthy
const tier1Foods = [
  { food: "Apples", emoji: "🍎", category: "Healthy", explanation: "Apples are full of vitamins and fiber!" },
  { food: "Broccoli", emoji: "🥦", category: "Healthy", explanation: "Broccoli is a super veggie with lots of nutrients!" },
  { food: "Bananas", emoji: "🍌", category: "Healthy", explanation: "Bananas give you energy and potassium!" },
  { food: "Carrots", emoji: "🥕", category: "Healthy", explanation: "Carrots are great for your eyes and health!" },
  { food: "Strawberries", emoji: "🍓", category: "Healthy", explanation: "Berries are packed with vitamins!" },
  { food: "Oranges", emoji: "🍊", category: "Healthy", explanation: "Oranges have vitamin C to keep you healthy!" },
  { food: "Grapes", emoji: "🍇", category: "Healthy", explanation: "Grapes are sweet and full of antioxidants!" },
  { food: "Watermelon", emoji: "🍉", category: "Healthy", explanation: "Watermelon keeps you hydrated and healthy!" },
  { food: "Spinach", emoji: "🥬", category: "Healthy", explanation: "Spinach makes you strong like Popeye!" },
  { food: "Blueberries", emoji: "🫐", category: "Healthy", explanation: "Blueberries are brain food!" },
  { food: "Tomatoes", emoji: "🍅", category: "Healthy", explanation: "Tomatoes are full of vitamins!" },
  { food: "Peaches", emoji: "🍑", category: "Healthy", explanation: "Peaches are delicious and nutritious!" },
  { food: "Candy", emoji: "🍬", category: "Not-So-Healthy", explanation: "Candy has lots of sugar, eat in moderation!" },
  { food: "Soda", emoji: "🥤", category: "Not-So-Healthy", explanation: "Soda has too much sugar and no nutrients!" },
  { food: "French Fries", emoji: "🍟", category: "Not-So-Healthy", explanation: "Fries are fried and have lots of salt!" },
  { food: "Donut", emoji: "🍩", category: "Not-So-Healthy", explanation: "Donuts are sugary treats, enjoy occasionally!" },
  { food: "Cookies", emoji: "🍪", category: "Not-So-Healthy", explanation: "Cookies are yummy but have lots of sugar!" },
  { food: "Ice Cream", emoji: "🍦", category: "Not-So-Healthy", explanation: "Ice cream is a sweet treat for special times!" },
  { food: "Popcorn", emoji: "🍿", category: "Not-So-Healthy", explanation: "Popcorn can have lots of salt and butter!" },
  { food: "Cake", emoji: "🍰", category: "Not-So-Healthy", explanation: "Cake is for celebrations, not every day!" },
];

// Tier 2: Food Groups
const tier2Foods = [
  { food: "Chicken", emoji: "🍗", category: "Protein", explanation: "Helps your muscles grow strong and ready to move!" },
  { food: "Milk", emoji: "🥛", category: "Dairy", explanation: "Helps build strong bones and teeth!" },
  { food: "Broccoli", emoji: "🥦", category: "Vegetable", explanation: "Gives your body power to stay healthy!" },
  { food: "Apples", emoji: "🍎", category: "Fruit", explanation: "Keeps your body energized and ready to play!" },
  { food: "Cheese", emoji: "🧀", category: "Dairy", explanation: "Cheese comes from milk!" },
  { food: "Carrots", emoji: "🥕", category: "Vegetable", explanation: "Helps your eyes see clearly!" },
  { food: "Bananas", emoji: "🍌", category: "Fruit", explanation: "Gives quick energy for play and sports!" },
  { food: "Fish", emoji: "🐟", category: "Protein", explanation: "Helps your brain think and learn!" },
  { food: "Eggs", emoji: "🥚", category: "Protein", explanation: "Eggs are packed with protein!" },
  { food: "Strawberries", emoji: "🍓", category: "Fruit", explanation: "Helps protect your body from getting sick!" },
  { food: "Spinach", emoji: "🥬", category: "Vegetable", explanation: "Spinach makes you strong like Popeye!" },
];

// Tier 3: Food Origins (Plants, Animals, Factory, Kitchen)
const tier3Foods = [
  // Plants
  { food: "Apple", emoji: "🍎", category: "Plants", explanation: "Apples grow on trees!" },
  { food: "Banana", emoji: "🍌", category: "Plants", explanation: "Bananas grow in bunches on tall plants!" },
  { food: "Carrot", emoji: "🥕", category: "Plants", explanation: "Carrots grow underground as roots!" },
  { food: "Corn", emoji: "🌽", category: "Plants", explanation: "Corn grows tall on stalks in fields!" },
  { food: "Potato", emoji: "🥔", category: "Plants", explanation: "Potatoes grow underground!" },
  { food: "Strawberry", emoji: "🍓", category: "Plants", explanation: "Strawberries grow close to the ground!" },
  { food: "Broccoli", emoji: "🥦", category: "Plants", explanation: "Broccoli is often cooked or eaten raw!" },
  { food: "Spinach", emoji: "🥬", category: "Plants", explanation: "Spinach is a leafy green that grows in soil!" },
  // Animals
  { food: "Milk", emoji: "🥛", category: "Animals", explanation: "Milk comes from cows!" },
  { food: "Cheese", emoji: "🧀", category: "Animals", explanation: "Cheese is a food made from milk!" },
  { food: "Eggs", emoji: "🥚", category: "Animals", explanation: "Eggs come from chickens!" },
  { food: "Chicken", emoji: "🍗", category: "Animals", explanation: "Chickens are raised on farms!" },
  { food: "Fish", emoji: "🐟", category: "Animals", explanation: "Fish live in rivers, lakes, and oceans!" },
  { food: "Butter", emoji: "🧈", category: "Animals", explanation: "Butter is made from cream from cows!" },
  { food: "Meat", emoji: "🥩", category: "Animals", explanation: "Meat comes from animals raised on farms!" },
  // Factory
  { food: "Cereal", emoji: "🥣", category: "Factory", explanation: "Cereal is made in factories from grains!" },
  { food: "Bread", emoji: "🍞", category: "Factory", explanation: "Bread is made in bakeries and factories!" },
  { food: "Pasta", emoji: "🍝", category: "Factory", explanation: "Pasta is made in factories from wheat!" },
  { food: "Popcorn", emoji: "🍿", category: "Factory", explanation: "Popcorn is packaged in factories!" },
  { food: "Chocolate", emoji: "🍫", category: "Factory", explanation: "Chocolate is made in factories from cocoa beans!" },
  { food: "Juice Box", emoji: "🧃", category: "Factory", explanation: "Juice boxes are made and packaged in factories!" },
  // Kitchen
  { food: "Pancakes", emoji: "🍳", category: "Kitchen", explanation: "Pancakes are cooked on a pan for breakfast!" },
  { food: "Salad", emoji: "🥗", category: "Kitchen", explanation: "Salads are mixed together in the kitchen!" },
  { food: "Sandwich", emoji: "🥪", category: "Kitchen", explanation: "Sandwiches are made by hand in the kitchen!" },
  { food: "Soup", emoji: "🍲", category: "Kitchen", explanation: "Soup is cooked in a pot in the kitchen!" },
  { food: "Smoothie", emoji: "🥤", category: "Kitchen", explanation: "Smoothies are blended in the kitchen!" },
  { food: "Spaghetti Sauce", emoji: "🍝", category: "Kitchen", explanation: "Spaghetti sauce is cooked on the stove!" },
  { food: "Cake", emoji: "🍰", category: "Kitchen", explanation: "Cakes are baked in the oven at home!" },
  { food: "Banana Bread", emoji: "🍞", category: "Kitchen", explanation: "Banana bread is baked fresh in the kitchen!" },
  { food: "Cookie", emoji: "🍪", category: "Kitchen", explanation: "Cookies are baked in the oven!" },
];

const usedFoods: { [key: number]: string[] } = {};

const generateTier1Puzzle = (excludeUsed: string[] = []): SortingPuzzle => {
  const availableFoods = tier1Foods.filter(f => !excludeUsed.includes(f.food));
  const item = availableFoods[Math.floor(Math.random() * availableFoods.length)];
  // Keep Healthy on left, Not-So-Healthy on right (no shuffle)
  const categories = ["Healthy", "Not-So-Healthy"];
  
  return {
    food: item.food,
    emoji: item.emoji,
    correctCategory: item.category,
    categories,
    explanation: item.explanation,
  };
};

const generateTier2Puzzle = (excludeUsed: string[] = []): SortingPuzzle => {
  const availableFoods = tier2Foods.filter(f => !excludeUsed.includes(f.food));
  const item = availableFoods[Math.floor(Math.random() * availableFoods.length)];
  // Fixed order: Fruit, Vegetable, Dairy, Protein
  const categories = ["Fruit", "Vegetable", "Dairy", "Protein"];
  
  return {
    food: item.food,
    emoji: item.emoji,
    correctCategory: item.category,
    categories,
    explanation: item.explanation,
  };
};

const generateTier3Puzzle = (excludeUsed: string[] = []): SortingPuzzle => {
  const availableFoods = tier3Foods.filter(f => !excludeUsed.includes(f.food));
  const item = availableFoods[Math.floor(Math.random() * availableFoods.length)];
  // Fixed order: Plants, Animals, Factory, Kitchen
  const categories = ["Plants", "Animals", "Factory", "Kitchen"];
  
  return {
    food: item.food,
    emoji: item.emoji,
    correctCategory: item.category,
    categories,
    explanation: item.explanation,
  };
};

export const generateSortingPuzzle = (tier: number, excludeUsed: string[] = []): SortingPuzzle => {
  switch (tier) {
    case 1:
      return generateTier1Puzzle(excludeUsed);
    case 2:
      return generateTier2Puzzle(excludeUsed);
    case 3:
      return generateTier3Puzzle(excludeUsed);
    default:
      return generateTier1Puzzle(excludeUsed);
  }
};
