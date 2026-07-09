export interface PatternPuzzle {
  pattern: string[];
  correctAnswer: string;
  options: string[];
  hint?: string;
}

const toppings = ["🧀", "🍄", "🌶️", "🍅", "🫑", "🥓"];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateTier1Pattern = (): PatternPuzzle => {
  // Simple AB patterns
  const [a, b] = shuffleArray(toppings).slice(0, 2);
  const pattern = [a, b, a, b, a];
  const correctAnswer = b;
  
  const wrongOptions = toppings.filter(t => t !== a && t !== b).slice(0, 2);
  const options = shuffleArray([correctAnswer, ...wrongOptions, a]);
  
  return {
    pattern,
    correctAnswer,
    options,
    hint: "Look for the repeating pattern!"
  };
};

const generateTier2Pattern = (): PatternPuzzle => {
  const patternType = Math.random() > 0.5 ? "ABC" : "AABB";
  
  if (patternType === "ABC") {
    // ABC patterns
    const [a, b, c] = shuffleArray(toppings).slice(0, 3);
    const pattern = [a, b, c, a, b];
    const correctAnswer = c;
    
    const wrongOptions = toppings.filter(t => t !== a && t !== b && t !== c).slice(0, 2);
    const options = shuffleArray([correctAnswer, ...wrongOptions, a]);
    
    return {
      pattern,
      correctAnswer,
      options,
      hint: "Three different toppings repeat!"
    };
  } else {
    // AABB patterns
    const [a, b] = shuffleArray(toppings).slice(0, 2);
    const pattern = [a, a, b, b, a];
    const correctAnswer = a;
    
    const wrongOptions = toppings.filter(t => t !== a && t !== b).slice(0, 2);
    const options = shuffleArray([correctAnswer, ...wrongOptions, b]);
    
    return {
      pattern,
      correctAnswer,
      options,
      hint: "Each topping appears twice before switching!"
    };
  }
};

const generateTier3Pattern = (): PatternPuzzle => {
  const patternTypes = ["ABCD", "ABAC", "AABBC"];
  const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
  
  if (patternType === "ABCD") {
    const [a, b, c, d] = shuffleArray(toppings).slice(0, 4);
    const pattern = [a, b, c, d, a, b];
    const correctAnswer = c;
    
    const wrongOptions = toppings.filter(t => ![a, b, c, d].includes(t)).slice(0, 2);
    const options = shuffleArray([correctAnswer, ...wrongOptions, d]);
    
    return {
      pattern,
      correctAnswer,
      options
    };
  } else if (patternType === "ABAC") {
    const [a, b, c] = shuffleArray(toppings).slice(0, 3);
    const pattern = [a, b, a, c, a];
    const correctAnswer = b;
    
    const wrongOptions = toppings.filter(t => t !== a && t !== b && t !== c).slice(0, 2);
    const options = shuffleArray([correctAnswer, ...wrongOptions, c]);
    
    return {
      pattern,
      correctAnswer,
      options
    };
  } else {
    const [a, b, c] = shuffleArray(toppings).slice(0, 3);
    const pattern = [a, a, b, b, c];
    const correctAnswer = c;
    
    const wrongOptions = toppings.filter(t => t !== a && t !== b && t !== c).slice(0, 2);
    const options = shuffleArray([correctAnswer, ...wrongOptions, a]);
    
    return {
      pattern,
      correctAnswer,
      options
    };
  }
};

export const generatePattern = (tier: number): PatternPuzzle => {
  switch (tier) {
    case 1:
      return generateTier1Pattern();
    case 2:
      return generateTier2Pattern();
    case 3:
      return generateTier3Pattern();
    default:
      return generateTier1Pattern();
  }
};
