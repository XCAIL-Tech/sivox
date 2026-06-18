import { useEffect } from "react";
import { useSivoxStore } from "@/store/useSivoxStore";
import { getPredictions, getInitialPredictions, loadDictionary } from "@/lib/prediction";

export function usePrediction() {
  const { composedText, wordHistory, setPredictions } = useSivoxStore();

  useEffect(() => {
    loadDictionary();
  }, []);

  useEffect(() => {
    const words = composedText.split(" ");
    const currentWord = words[words.length - 1] ?? "";

    if (!currentWord) {
      // Texto vacío o recién escrito un espacio: historial personal → defaults
      setPredictions(getInitialPredictions(wordHistory));
    } else {
      setPredictions(getPredictions(currentWord, wordHistory));
    }
  }, [composedText, wordHistory, setPredictions]);
}
