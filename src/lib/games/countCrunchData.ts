import { DifficultyTier } from "@/pages/CountCrunch";

export interface Question {
  questionText: string;
  correctAnswer: number;
  options: number[];
  emoji: string;
  emoji2?: string;
  num1?: number;
  num2?: number;
  type: "count" | "add" | "missing";
}

const foodEmojis = ["🍎", "🍕", "🍪", "🍌", "🍇", "🥕", "🍓", "🥦", "🍊", "🍉"];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateOptions = (correct: number, count: number = 4, range: number = 5): number[] => {
  const options = new Set<number>([correct]);
  
  while (options.size < count) {
    const offset = Math.floor(Math.random() * range) + 1;
    const newOption = Math.random() > 0.5 ? correct + offset : correct - offset;
    if (newOption > 0 && newOption !== correct) {
      options.add(newOption);
    }
  }
  
  return shuffleArray([...options]);
};

export const generateQuestion = (tier: DifficultyTier): Question => {
  const emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  
  if (tier === 1) {
    // Tier 1: Count from 1-10
    const count = Math.floor(Math.random() * 10) + 1;
    return {
      questionText: `How many ${emoji} do you see?`,
      correctAnswer: count,
      options: generateOptions(count, 4, 3),
      emoji,
      type: "count"
    };
  } else if (tier === 2) {
    // Tier 2: Addition up to 20 with visual emojis
    const num1 = Math.floor(Math.random() * 8) + 1; // 1-8 to keep emoji count reasonable
    const num2 = Math.floor(Math.random() * 8) + 1;
    const sum = num1 + num2;
    
    // Pick two different emojis
    const emoji1 = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    let emoji2 = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    while (emoji2 === emoji1) {
      emoji2 = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    }
    
    return {
      questionText: ``,
      correctAnswer: sum,
      options: generateOptions(sum, 4, 5),
      emoji: emoji1,
      emoji2: emoji2,
      num1: num1,
      num2: num2,
      type: "add"
    };
  } else {
    // Tier 3: Timed addition and missing addends
    if (Math.random() > 0.5) {
      // Addition
      const num1 = Math.floor(Math.random() * 15) + 1;
      const num2 = Math.floor(Math.random() * 15) + 1;
      const sum = num1 + num2;
      
      return {
        questionText: `${num1} + ${num2} = ?`,
        correctAnswer: sum,
        options: generateOptions(sum, 4, 6),
        emoji,
        type: "add"
      };
    } else {
      // Missing addend
      const num1 = Math.floor(Math.random() * 15) + 1;
      const sum = num1 + Math.floor(Math.random() * 15) + 1;
      const missing = sum - num1;
      
      return {
        questionText: `${num1} + ? = ${sum}`,
        correctAnswer: missing,
        options: generateOptions(missing, 4, 6),
        emoji,
        type: "missing"
      };
    }
  }
};
