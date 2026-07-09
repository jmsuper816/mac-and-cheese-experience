// Centralized game threshold configuration for sticker book display

export interface TierInfo {
  name: string;
  emoji: string;
  threshold: number;
}

export interface GameThreshold {
  gameId: string;
  name: string;
  emoji: string;
  type: "percentage" | "points";
  tiers: {
    1: TierInfo;
    2: TierInfo;
    3: TierInfo;
  };
}

export const GAME_THRESHOLDS: GameThreshold[] = [
  {
    gameId: "count-crunch",
    name: "Count Crunch",
    emoji: "🔢",
    type: "percentage",
    tiers: {
      1: { name: "Easy Peasy", emoji: "🍎", threshold: 60 },
      2: { name: "Getting Tasty", emoji: "🥣", threshold: 60 },
      3: { name: "Super Chef", emoji: "👨‍🍳", threshold: 60 },
    },
  },
  {
    gameId: "pattern-pizza",
    name: "Pattern Pizza",
    emoji: "🍕",
    type: "percentage",
    tiers: {
      1: { name: "Simple Slice", emoji: "🍕", threshold: 60 },
      2: { name: "Extra Toppings", emoji: "🧀", threshold: 60 },
      3: { name: "The Works", emoji: "🌶️", threshold: 60 },
    },
  },
  {
    gameId: "word-wich",
    name: "Word-Wich",
    emoji: "🥪",
    type: "percentage",
    tiers: {
      1: { name: "Little Bites", emoji: "🧁", threshold: 60 },
      2: { name: "Full Stack", emoji: "🥪", threshold: 60 },
      3: { name: "Mega Stack", emoji: "🌮", threshold: 60 },
    },
  },
  {
    gameId: "sort-n-snack",
    name: "Sort-n-Snack",
    emoji: "🍎",
    type: "percentage",
    tiers: {
      1: { name: "Healthy Start", emoji: "🍎", threshold: 60 },
      2: { name: "Food Groups", emoji: "🥦", threshold: 60 },
      3: { name: "Food Origins", emoji: "🍳", threshold: 60 },
    },
  },
  {
    gameId: "kitchen-dash",
    name: "Kitchen Dash",
    emoji: "👨‍🍳",
    type: "percentage",
    tiers: {
      1: { name: "Junior Chef", emoji: "👨‍🍳", threshold: 60 },
      2: { name: "Sous Chef", emoji: "👨‍🍳", threshold: 60 },
      3: { name: "Master Chef", emoji: "👨‍🍳", threshold: 60 },
    },
  },
  {
    gameId: "snack-attack",
    name: "Snack Attack",
    emoji: "⚡",
    type: "points",
    tiers: {
      1: { name: "Snack Starter", emoji: "⚡", threshold: 150 },
      2: { name: "Food Fighter", emoji: "⚡", threshold: 300 },
      3: { name: "Reflex Master", emoji: "⚡", threshold: 50 },
    },
  },
];

export const getGameThreshold = (gameId: string): GameThreshold | undefined => {
  return GAME_THRESHOLDS.find((g) => g.gameId === gameId);
};

export const getTierInfo = (gameId: string, tier: number): TierInfo | undefined => {
  const game = getGameThreshold(gameId);
  if (!game) return undefined;
  return game.tiers[tier as 1 | 2 | 3];
};

export const getTierRequirement = (gameId: string, tier: number): string => {
  const game = getGameThreshold(gameId);
  if (!game) return "60%+";

  const tierData = game.tiers[tier as 1 | 2 | 3];
  if (!tierData) return "60%+";

  if (game.type === "points") {
    return `${tierData.threshold}+ pts`;
  }
  return `${tierData.threshold}%+`;
};
