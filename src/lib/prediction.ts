import { DEFAULT_INITIAL_WORDS } from "@/config/defaults";

let dictionary: Record<string, number> = {};
let loaded = false;

export async function loadDictionary(): Promise<void> {
  if (loaded) return;
  try {
    const res = await fetch("/data/diccionario_es.json");
    dictionary = await res.json();
    loaded = true;
  } catch {
    // offline o archivo no disponible — predicción vacía
    loaded = true;
  }
}

// Predicciones cuando no hay texto: historial personal → defaults
export function getInitialPredictions(
  wordHistory: Record<string, number>,
  limit = 8
): string[] {
  const historyWords = Object.entries(wordHistory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);

  if (historyWords.length >= limit) return historyWords;

  const needed = limit - historyWords.length;
  const fill = DEFAULT_INITIAL_WORDS.filter((w) => !historyWords.includes(w)).slice(0, needed);
  return [...historyWords, ...fill];
}

export function getPredictions(
  currentWord: string,
  wordHistory: Record<string, number>,
  limit = 8
): string[] {
  if (!currentWord) return [];

  const prefix = currentWord.toLowerCase();
  const combined: Record<string, number> = { ...dictionary };

  for (const [word, count] of Object.entries(wordHistory)) {
    combined[word] = (combined[word] ?? 0) + count * 10;
  }

  const prefixMatches = Object.entries(combined)
    .filter(([word]) => word.startsWith(prefix) && word !== prefix)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);

  if (prefixMatches.length >= limit) return prefixMatches;

  // Completar hasta 8 con palabras frecuentes cuando hay pocos matches
  const needed = limit - prefixMatches.length;
  const fill = getInitialPredictions(wordHistory, limit)
    .filter((w) => !prefixMatches.includes(w))
    .slice(0, needed);

  return [...prefixMatches, ...fill];
}
