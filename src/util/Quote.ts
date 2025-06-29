// Définition du type de chaque entrée
interface Quote {
  /** Texte complet du proverbe / de la citation */
  text: string;
  /** Auteur ou source (Proverb pour un proverbe anonyme) */
  author: string;
}

// Tableau de 20 proverbes et citations plus détaillés
const quotes: Quote[] = [
  { text: "Actions speak louder than words.", author: "English Proverb" },
  {
    text: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
  },
  {
    text: "The only thing we have to fear is fear itself.",
    author: "Franklin D. Roosevelt",
  },
  { text: "I think, therefore I am.", author: "René Descartes" },
  { text: "The early bird catches the worm.", author: "English Proverb" },
  {
    text: "That's one small step for a man, one giant leap for mankind.",
    author: "Neil Armstrong",
  },
  {
    text: "Don't count your chickens before they hatch.",
    author: "English Proverb",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "The pen is mightier than the sword.",
    author: "Edward Bulwer-Lytton",
  },
  { text: "Every cloud has a silver lining.", author: "English Proverb" },
  { text: "Fortune favors the bold.", author: "Latin Proverb" },
  {
    text: "To be, or not to be, that is the question.",
    author: "William Shakespeare",
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
  },
  {
    text: "What we know is a drop, what we don't know is an ocean.",
    author: "Isaac Newton",
  },
  {
    text: "It's not the years in your life that count. It's the life in your years.",
    author: "Abraham Lincoln",
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
  },
  {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
  },
  { text: "Practice makes perfect.", author: "English Proverb" },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  },
  {
    text: "You may not control all the events that happen to you, but you can decide not to be reduced by them.",
    author: "Maya Angelou",
  },
  {
    text: "Tell me and I forget, teach me and I may remember, involve me and I learn.",
    author: "Benjamin Franklin",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Your time is limited, so don't waste it living someone else's life; have the courage to follow your heart and intuition.",
    author: "Steve Jobs",
  },
  {
    text: "Do not go where the path may lead; go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams and are willing to work for them.",
    author: "Eleanor Roosevelt",
  },
  {
    text: "We are not makers of history; we are made by history, yet we must shape the future with our actions.",
    author: "Martin Luther King Jr.",
  },
  {
    text: "Logic will get you from A to Z; imagination will get you everywhere, opening doors you never knew existed.",
    author: "Albert Einstein",
  },
  {
    text: "I have not failed; I've just found ten thousand ways that will not work, each bringing me nearer to success.",
    author: "Thomas A. Edison",
  },
  {
    text: "Life isn't about finding yourself; life is about creating yourself and sculpting each day into something worth remembering.",
    author: "George Bernard Shaw",
  },
  {
    text: "The secret of getting ahead is getting started, even when the way forward appears uncertain and steep.",
    author: "Mark Twain",
  },
  {
    text: "We are all in the gutter, but some of us are looking at the stars, searching for something greater.",
    author: "Oscar Wilde",
  },
  {
    text: "Optimism is the faith that leads to achievement; nothing can be done without hope and confidence.",
    author: "Helen Keller",
  },
  {
    text: "A room without books is like a body without a soul; knowledge breathes life into the quietest places.",
    author: "Marcus Tullius Cicero",
  },
  {
    text: "Not everything that is faced can be changed, but nothing can be changed until it is faced.",
    author: "James Baldwin",
  },
  {
    text: "The voyage of discovery is not in seeking new landscapes, but in having new eyes to observe them.",
    author: "Marcel Proust",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop on the road to progress.",
    author: "Confucius",
  },
  {
    text: "Those who realize their folly are not true fools; acknowledging ignorance is the first step toward wisdom.",
    author: "Zhuangzi",
  },
  {
    text: "Dream as if you'll live forever; live as if you'll die today, embracing each moment wholeheartedly.",
    author: "James Dean",
  },
];

export interface QuoteData {
  index: number;
  quote: Quote;
}

/**
 * Renvoie une citation aléatoire avec son index dans le tableau.
 * @returns { index: number; quote: Quote }
 */
export function getRandomQuote(): QuoteData {
  const index = Math.floor(Math.random() * quotes.length);
  return { index: index + 1, quote: quotes[index] };
}

/**
 * Renvoie un tableau de `count` citations aléatoires distinctes.
 * Si `count` dépasse la taille de `quotes`, toutes les citations sont retournées.
 *
 * @param count Nombre de citations souhaité
 * @returns Un tableau d’objets { index: number; quote: Quote }
 */
export function getRandomQuotesArray(
  count: number
): { index: number; quote: Quote }[] {
  // Sécurité : on ne dépasse pas la taille disponible
  const max = Math.min(count, quotes.length);

  // 1. On crée un tableau d’indices [0, 1, 2, ...]
  const indices = quotes.map((_, i) => i);

  // 2. Shuffle in-place (Fisher–Yates)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // 3. On prend les `max` premiers indices mélangés
  return indices.slice(0, max).map((i) => ({
    index: i + 1, // 1-based comme dans getRandomQuote
    quote: quotes[i],
  }));
}
