import { DifficultyTier } from "@/pages/WordWich";

export interface WordPuzzle {
  word: string;
  syllables: string[];
  shuffledSyllables: string[];
  hint: string;
}

const tier1Words = [
  { word: "apple", syllables: ["ap", "ple"], hint: "red or green fruit" },
  { word: "cookie", syllables: ["cook", "ie"], hint: "sweet baked treat" },
  { word: "pizza", syllables: ["piz", "za"], hint: "round with cheese and toppings" },
  { word: "taco", syllables: ["ta", "co"], hint: "folded shell with filling" },
  { word: "carrot", syllables: ["car", "rot"], hint: "orange vegetable" },
  { word: "orange", syllables: ["or", "ange"], hint: "citrus fruit" },
  { word: "sandwich", syllables: ["sand", "wich"], hint: "bread with filling" },
  { word: "pancake", syllables: ["pan", "cake"], hint: "flat breakfast with syrup" },
  { word: "waffle", syllables: ["waf", "fle"], hint: "square breakfast with syrup" },
  { word: "yogurt", syllables: ["yo", "gurt"], hint: "creamy dairy snack" },
  { word: "noodle", syllables: ["noo", "dle"], hint: "pasta" },
  { word: "butter", syllables: ["but", "ter"], hint: "spread on bread" },
  { word: "pickle", syllables: ["pick", "le"], hint: "sour green cucumber" },
  { word: "pepper", syllables: ["pep", "per"], hint: "crunchy veggie or spice" },
  { word: "muffin", syllables: ["muf", "fin"], hint: "small sweet cake" },
  { word: "cupcake", syllables: ["cup", "cake"], hint: "small cake with frosting" },
  { word: "pretzel", syllables: ["pret", "zel"], hint: "twisted salty snack" },
  { word: "ketchup", syllables: ["ketch", "up"], hint: "red tomato sauce" },
  { word: "mustard", syllables: ["mus", "tard"], hint: "yellow spicy spread" },
  { word: "chicken", syllables: ["chick", "en"], hint: "🐔" },
  { word: "burger", syllables: ["bur", "ger"], hint: "beef patty in bun" },
  { word: "hotdog", syllables: ["hot", "dog"], hint: "sausage in a bun" },
  { word: "popcorn", syllables: ["pop", "corn"], hint: "movie theater snack" },
  { word: "pasta", syllables: ["pas", "ta"], hint: "italian noodles" },
  { word: "water", syllables: ["wa", "ter"], hint: "drink to stay hydrated" },
  { word: "smoothie", syllables: ["smoo", "thie"], hint: "blended fruit drink" },
  { word: "brownie", syllables: ["brow", "nie"], hint: "chocolate square treat" },
  { word: "veggie", syllables: ["veg", "gie"], hint: "short for vegetable" },
  { word: "dessert", syllables: ["des", "sert"], hint: "sweet after dinner" },
  { word: "lettuce", syllables: ["let", "tuce"], hint: "green salad leaf" },
  { word: "bagel", syllables: ["ba", "gel"], hint: "round bread with hole" },
  { word: "donut", syllables: ["do", "nut"], hint: "round with hole in middle" },
  { word: "teapot", syllables: ["tea", "pot"], hint: "heats water for tea" },
  { word: "toaster", syllables: ["toast", "er"], hint: "makes bread crispy" },
  { word: "blender", syllables: ["blend", "er"], hint: "mixes smoothies" },
  { word: "apron", syllables: ["a", "pron"], hint: "protects clothes while cooking" },
  { word: "oven", syllables: ["ov", "en"], hint: "bakes and cooks food" },
  { word: "timer", syllables: ["ti", "mer"], hint: "beeps when done" },
  { word: "freezer", syllables: ["freez", "er"], hint: "keeps food frozen" },
  { word: "kitchen", syllables: ["kitch", "en"], hint: "room where you cook" },
];

const tier2Words = [
  { word: "applesauce", syllables: ["ap", "ple", "sauce"], hint: "mushy apples" },
  { word: "marshmallow", syllables: ["marsh", "mal", "low"], hint: "soft fluffy candy" },
  { word: "tater tots", syllables: ["ta", "ter", "tots"], hint: "crispy potato bites" },
  { word: "banana", syllables: ["ba", "na", "na"], hint: "yellow curved fruit" },
  { word: "spaghetti", syllables: ["spa", "ghet", "ti"], hint: "long pasta noodles" },
  { word: "chocolate", syllables: ["choc", "o", "late"], hint: "sweet brown treat" },
  { word: "strawberry", syllables: ["straw", "ber", "ry"], hint: "red berry with seeds" },
  { word: "blueberry", syllables: ["blue", "ber", "ry"], hint: "tiny blue fruit" },
  { word: "raspberry", syllables: ["rasp", "ber", "ry"], hint: "red bumpy berry" },
  { word: "pineapple", syllables: ["pine", "ap", "ple"], hint: "tropical spiky fruit" },
  { word: "hamburger", syllables: ["ham", "bur", "ger"], hint: "beef patty in bun" },
  { word: "broccoli", syllables: ["broc", "co", "li"], hint: "green tree vegetable" },
  { word: "cucumber", syllables: ["cu", "cum", "ber"], hint: "green crunchy veggie" },
  { word: "tomato", syllables: ["to", "ma", "to"], hint: "red sauce ingredient" },
  { word: "potato", syllables: ["po", "ta", "to"], hint: "makes fries and chips" },
  { word: "tortilla", syllables: ["tor", "til", "la"], hint: "flat bread for wraps" },
  { word: "cinnamon", syllables: ["cin", "na", "mon"], hint: "warm brown spice" },
  { word: "vanilla", syllables: ["va", "nil", "la"], hint: "sweet flavor from beans" },
  { word: "celery", syllables: ["cel", "er", "y"], hint: "crunchy green stalk" },
  { word: "artichoke", syllables: ["ar", "ti", "choke"], hint: "spiky green veggie" },
  { word: "zucchini", syllables: ["zuc", "chi", "ni"], hint: "green summer squash" },
  { word: "granola", syllables: ["gra", "no", "la"], hint: "crunchy oat clusters" },
  { word: "cereal", syllables: ["cer", "e", "al"], hint: "breakfast in a bowl" },
  { word: "honeydew", syllables: ["hon", "ey", "dew"], hint: "green sweet melon" },
  { word: "tangerine", syllables: ["tan", "ger", "ine"], hint: "small sweet orange" },
  { word: "coconut", syllables: ["co", "co", "nut"], hint: "tropical hairy fruit" },
  { word: "barbecue", syllables: ["bar", "be", "cue"], hint: "grilled smoky food" },
  { word: "seasoning", syllables: ["sea", "son", "ing"], hint: "spices for flavor" },
  { word: "beverage", syllables: ["bev", "er", "age"], hint: "any kind of drink" },
  { word: "lemonade", syllables: ["lem", "on", "ade"], hint: "sweet yellow drink" },
  { word: "spatula", syllables: ["spat", "u", "la"], hint: "flips food in pan" },
];

const tier3Words = [
  { word: "applesauce", syllables: ["ap", "ple", "sauce"], hint: "smooth apple puree" },
  { word: "marshmallow", syllables: ["marsh", "mal", "low"], hint: "soft fluffy white candy" },
  { word: "tater tots", syllables: ["ta", "ter", "tots"], hint: "crispy potato bites" },
  { word: "banana", syllables: ["ba", "na", "na"], hint: "yellow curved fruit" },
  { word: "spaghetti", syllables: ["spa", "ghet", "ti"], hint: "long pasta noodles" },
  { word: "chocolate", syllables: ["choc", "o", "late"], hint: "sweet brown treat" },
  { word: "strawberry", syllables: ["straw", "ber", "ry"], hint: "red berry with seeds" },
  { word: "blueberry", syllables: ["blue", "ber", "ry"], hint: "tiny blue fruit" },
  { word: "raspberry", syllables: ["rasp", "ber", "ry"], hint: "red bumpy berry" },
  { word: "pineapple", syllables: ["pine", "ap", "ple"], hint: "tropical spiky fruit" },
  { word: "hamburger", syllables: ["ham", "bur", "ger"], hint: "beef patty in bun" },
  { word: "broccoli", syllables: ["broc", "co", "li"], hint: "green tree vegetable" },
  { word: "cucumber", syllables: ["cu", "cum", "ber"], hint: "green crunchy veggie" },
  { word: "tomato", syllables: ["to", "ma", "to"], hint: "red sauce ingredient" },
  { word: "potato", syllables: ["po", "ta", "to"], hint: "makes fries and chips" },
  { word: "tortilla", syllables: ["tor", "til", "la"], hint: "flat bread for wraps" },
  { word: "cinnamon", syllables: ["cin", "na", "mon"], hint: "warm brown spice" },
  { word: "vanilla", syllables: ["va", "nil", "la"], hint: "sweet flavor from beans" },
  { word: "celery", syllables: ["cel", "er", "y"], hint: "crunchy green stalk" },
  { word: "artichoke", syllables: ["ar", "ti", "choke"], hint: "veggie with leaves" },
  { word: "zucchini", syllables: ["zuc", "chi", "ni"], hint: "green summer squash" },
  { word: "granola", syllables: ["gra", "no", "la"], hint: "crunchy oat clusters" },
  { word: "cereal", syllables: ["cer", "e", "al"], hint: "breakfast in a bowl" },
  { word: "honeydew", syllables: ["hon", "ey", "dew"], hint: "green sweet melon" },
  { word: "tangerine", syllables: ["tan", "ger", "ine"], hint: "small sweet orange" },
  { word: "coconut", syllables: ["co", "co", "nut"], hint: "tropical hairy fruit" },
  { word: "barbecue", syllables: ["bar", "be", "cue"], hint: "grilled smoky food" },
  { word: "seasoning", syllables: ["sea", "son", "ing"], hint: "spices for flavor" },
  { word: "beverage", syllables: ["bev", "er", "age"], hint: "any kind of drink" },
  { word: "lemonade", syllables: ["lem", "on", "ade"], hint: "sweet yellow drink" },
];

const tier4Words = [
  { word: "measuring cup", syllables: ["mea", "sur", "ing", "cup"], hint: "pour and measure with this" },
  { word: "cookie cutter", syllables: ["cook", "ie", "cut", "ter"], hint: "shapes dough" },
  { word: "pepper shaker", syllables: ["pep", "per", "sha", "ker"], hint: "holds black spice" },
  { word: "oven mittens", syllables: ["ov", "en", "mit", "tens"], hint: "protects from heat" },
  { word: "dinner table", syllables: ["din", "ner", "ta", "ble"], hint: "where family eats" },
  { word: "kitchen timer", syllables: ["kitch", "en", "ti", "mer"], hint: "beeps when done" },
  { word: "cooking apron", syllables: ["cook", "ing", "a", "pron"], hint: "protects your clothes" },
  { word: "pepperoni", syllables: ["pep", "per", "o", "ni"], hint: "pizza meat topping" },
  { word: "macaroni", syllables: ["mac", "a", "ro", "ni"], hint: "elbow shaped pasta" },
  { word: "watermelon", syllables: ["wa", "ter", "mel", "on"], hint: "big green fruit, pink inside" },
  { word: "guacamole", syllables: ["gua", "ca", "mo", "le"], hint: "green avocado dip" },
  { word: "chicken tenders", syllables: ["chick", "en", "ten", "ders"], hint: "crispy breaded strips" },
  { word: "spaghetti sauce", syllables: ["spa", "ghet", "ti", "sauce"], hint: "red pasta topping" },
  { word: "avocado", syllables: ["av", "o", "ca", "do"], hint: "green for guacamole" },
  { word: "mozzarella", syllables: ["moz", "za", "rel", "la"], hint: "stretchy pizza cheese" },
  { word: "quesadilla", syllables: ["que", "sa", "dil", "la"], hint: "cheesy tortilla" },
  { word: "cauliflower", syllables: ["cau", "li", "flow", "er"], hint: "white broccoli cousin" },
  { word: "asparagus", syllables: ["a", "spar", "a", "gus"], hint: "long green veggie spears" },
  { word: "cinnamon roll", syllables: ["cin", "na", "mon", "roll"], hint: "sweet spiral pastry" },
  { word: "chicken nugget", syllables: ["chick", "en", "nug", "get"], hint: "breaded bite-sized dipper" },
  { word: "peanut butter", syllables: ["pea", "nut", "but", "ter"], hint: "spread for sandwiches" },
  { word: "measuring spoon", syllables: ["mea", "sur", "ing", "spoon"], hint: "small kitchen scoop" },
  { word: "potato salad", syllables: ["po", "ta", "to", "sal", "ad"], hint: "cold creamy side dish" },
  { word: "banana bread", syllables: ["ba", "na", "na", "bread"], hint: "sweet fruit loaf" },
  { word: "banana split", syllables: ["ba", "na", "na", "split"], hint: "ice cream sundae" },
  { word: "chocolate milk", syllables: ["choc", "o", "late", "milk"], hint: "brown sweet drink" },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateWordPuzzle = (tier: DifficultyTier, usedWords: string[] = []): WordPuzzle => {
  let wordList: typeof tier1Words;
  
  if (tier === 1) {
    wordList = tier1Words;
  } else if (tier === 2) {
    wordList = tier2Words;
  } else if (tier === 3) {
    wordList = tier3Words;
  } else {
    wordList = tier4Words;
  }
  
  // Filter out already used words
  const availableWords = wordList.filter(w => !usedWords.includes(w.word));
  
  // If all words used, reset (shouldn't happen with enough words)
  const wordsToUse = availableWords.length > 0 ? availableWords : wordList;
  
  const selectedWord = wordsToUse[Math.floor(Math.random() * wordsToUse.length)];
  
  return {
    word: selectedWord.word,
    syllables: selectedWord.syllables,
    shuffledSyllables: shuffleArray([...selectedWord.syllables]),
    hint: selectedWord.hint,
  };
};
