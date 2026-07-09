export interface FallingFood {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  emoji: string;
  isGood: boolean;
  hit: boolean;
}

const goodFoods = ["🍎", "🥕", "🍇", "🍊", "🥦", "🍌", "🍓", "🥬"];
const badFoods = ["🍕", "🍩", "🍔", "🍟", "🍰", "🍪", "🌭", "🥤"];

export const generateFoods = (tier: number, count: number): FallingFood[] => {
  const foods: FallingFood[] = [];
  
  // Tier affects the ratio of good to bad foods
  const goodFoodChance = tier === 1 ? 0.6 : tier === 2 ? 0.5 : 0.4;
  
  for (let i = 0; i < count; i++) {
    const isGood = Math.random() < goodFoodChance;
    const foodArray = isGood ? goodFoods : badFoods;
    const emoji = foodArray[Math.floor(Math.random() * foodArray.length)];
    
    foods.push({
      id: `food-${Date.now()}-${Math.random()}`,
      x: Math.random() * 90 + 5, // 5% to 95%
      y: -5, // Start above the screen
      emoji,
      isGood,
      hit: false,
    });
  }
  
  return foods;
};

export const checkCollision = (food: FallingFood, playerPosition: number): boolean => {
  const distance = Math.abs(food.x - playerPosition);
  return distance < 12; // 12% hitbox width for better edge catching
};
