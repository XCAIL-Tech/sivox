import { useCallback } from "react";
import { TextDisplay } from "@/components/TextDisplay";
import { Grid } from "@/components/Grid";
import { SelectButton } from "@/components/SelectButton";
import { SpeedSelector } from "@/components/SpeedSelector";
import { useSivoxStore } from "@/store/useSivoxStore";
import { useScanner } from "@/hooks/useScanner";
import { usePrediction } from "@/hooks/usePrediction";
import { buildAllRows } from "@/lib/layouts";
import type { GridCell } from "@/types";

export default function App() {
  const {
    settings,
    predictions,
    appendChar,
    deleteLastChar,
    clearText,
    speak,
    selectPrediction,
    toggleCaps,
    recordWordUsage,
  } = useSivoxStore();

  usePrediction();

  // Única fuente de verdad para el scanner — igual estructura que Grid.tsx
  const allRows = buildAllRows(predictions, settings.layout);

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
        case "speak":
          speak();
          break;
        case "backspace":
          deleteLastChar();
          break;
        case "clear":
          clearText();
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

  const { handleSelect } = useScanner({ rows: allRows, onCellSelect: handleCellSelect });

  return (
    <div className="h-full flex flex-col bg-background no-select overflow-hidden">

      {/* Navbar */}
      <header className="flex items-center justify-between px-4 py-2 shrink-0 border-b border-border/50">
        <span className="text-sivox-500 font-bold text-base tracking-widest">
          SIVOX
        </span>
        <span className="text-xs text-muted-foreground">XCAIL Technologies</span>
      </header>

      {/* Caja de texto */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <TextDisplay />
      </div>

      {/* Separador visual */}
      <div className="mx-3 border-t border-border/30 shrink-0" />

      {/* Grid — ocupa todo el espacio disponible */}
      <div className="flex-1 min-h-0 px-3 py-2">
        <Grid />
      </div>

      {/* Separador visual */}
      <div className="mx-3 border-t border-border/30 shrink-0" />

      {/* Panel inferior: velocidad + botones */}
      <div className="shrink-0 pb-2 pt-2 flex flex-col gap-2">
        <SpeedSelector />
        <SelectButton onSelect={handleSelect} />
      </div>

    </div>
  );
}
