import { useCallback } from "react";
import { TextDisplay } from "@/components/TextDisplay";
import { Grid } from "@/components/Grid";
import { SelectButton } from "@/components/SelectButton";
import { SpeedSelector } from "@/components/SpeedSelector";
import { useSivoxStore } from "@/store/useSivoxStore";
import { useScanner } from "@/hooks/useScanner";
import { usePrediction } from "@/hooks/usePrediction";
import { buildAllRows, buildSosRows } from "@/lib/layouts";
import type { GridCell } from "@/types";

export default function App() {
  const {
    settings,
    predictions,
    row0Mode,
    isSos,
    sosConfirming,
    appendChar,
    deleteLastChar,
    clearText,
    speak,
    selectPrediction,
    applyFrase,
    toggleCaps,
    recordWordUsage,
    setRow0Mode,
    activateSos,
    continueSos,
    initiateCancelSos,
    confirmCancelSos,
  } = useSivoxStore();

  usePrediction();

  // Durante SOS el scanner usa las filas de alerta; en modo normal usa el teclado completo
  const allRows = isSos
    ? buildSosRows(sosConfirming)
    : buildAllRows(predictions, settings.layout, row0Mode);

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
        case "number":
          appendChar(cell.value ?? cell.label);
          break;
        case "prediction":
          if (cell.value) {
            selectPrediction(cell.value);
            recordWordUsage(cell.value);
          }
          break;
        case "frase":
          if (cell.value) {
            applyFrase(cell.value);
            setRow0Mode("predictions");
          }
          break;
        case "frases":
          setRow0Mode("frases");
          break;
        case "numeros":
          setRow0Mode("numeros");
          break;
        case "back":
          setRow0Mode("predictions");
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
        case "sos":
          activateSos();
          break;
        case "sos-continue":
        case "sos-confirm-continue":
          continueSos();
          break;
        case "sos-cancel-init":
          initiateCancelSos();
          break;
        case "sos-confirm-cancel":
          confirmCancelSos();
          break;
        case "indicator":
          break; // celda buffer visual — no hace nada al seleccionarse
        default:
          break;
      }
    },
    [
      appendChar, deleteLastChar, clearText, speak, selectPrediction,
      applyFrase, toggleCaps, recordWordUsage, setRow0Mode,
      activateSos, continueSos, initiateCancelSos, confirmCancelSos,
    ]
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
