import { useCallback } from "react";
import { TextDisplay } from "@/components/TextDisplay";
import { Grid } from "@/components/Grid";
import { SelectButton } from "@/components/SelectButton";
import { useSivoxStore } from "@/store/useSivoxStore";
import { useScanner } from "@/hooks/useScanner";
import { usePrediction } from "@/hooks/usePrediction";
import { QWERTY_ROWS, ALPHABETICAL_ROWS } from "@/lib/layouts";
import type { GridCell } from "@/types";

export default function App() {
  const {
    isScanning,
    settings,
    appendChar,
    deleteLastChar,
    clearText,
    speak,
    selectPrediction,
    toggleCaps,
    recordWordUsage,
  } = useSivoxStore();

  usePrediction();

  const letterRows =
    settings.layout === "qwerty" ? QWERTY_ROWS : ALPHABETICAL_ROWS;

  // Fila 0 de predicciones — vacía como placeholder para el scanner
  const predictionRowPlaceholder: GridCell[] = Array.from({ length: 10 }, (_, i) => ({
    id: `pred-ph-${i}`,
    label: "",
    type: "prediction" as const,
  }));

  const allRows = [predictionRowPlaceholder, ...letterRows];

  const handleCellSelect = useCallback(
    (cell: GridCell) => {
      if (!cell.label) return;

      switch (cell.type) {
        case "letter":
        case "space":
        case "punctuation":
        case "enter":
          appendChar(cell.value ?? cell.label);
          break;
        case "prediction":
          if (cell.value) {
            selectPrediction(cell.value);
            recordWordUsage(cell.value);
          }
          break;
        case "backspace":
          deleteLastChar();
          break;
        case "clear":
          clearText();
          break;
        case "speak":
          speak();
          break;
        case "caps":
          toggleCaps();
          break;
        default:
          break;
      }
    },
    [appendChar, deleteLastChar, clearText, speak, selectPrediction, toggleCaps, recordWordUsage]
  );

  const { handleSelect } = useScanner({
    rows: allRows,
    onCellSelect: handleCellSelect,
  });

  return (
    <div className="h-full flex flex-col bg-background p-2 gap-2 no-select">
      {/* Navbar */}
      <header className="flex items-center justify-between px-2 shrink-0">
        <span className="text-sivox-500 font-bold text-lg tracking-widest">
          SIVOX
        </span>
        <span className="text-xs text-muted-foreground">XCAIL Technologies</span>
      </header>

      {/* Display */}
      <div className="shrink-0">
        <TextDisplay />
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0">
        <Grid />
      </div>

      {/* Botón central */}
      <div className="flex justify-center shrink-0 pb-1">
        <SelectButton onSelect={handleSelect} isScanning={isScanning} />
      </div>
    </div>
  );
}
