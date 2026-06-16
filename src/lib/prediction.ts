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

  return Object.entries(combined)
    .filter(([word]) => word.startsWith(prefix) && word !== prefix)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}
