import { useEffect } from "react";
import { useSivoxStore } from "@/store/useSivoxStore";
import { getPredictions, loadDictionary } from "@/lib/prediction";

export function usePrediction() {
  const { composedText, wordHistory, setPredictions } = useSivoxStore();

  useEffect(() => {
    loadDictionary();
  }, []);

  useEffect(() => {
    const words = composedText.split(" ");
    const currentWord = words[words.length - 1] ?? "";
    const predictions = getPredictions(currentWord, wordHistory);
    setPredictions(predictions);
  }, [composedText, wordHistory, setPredictions]);
}
