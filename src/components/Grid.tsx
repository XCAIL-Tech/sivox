import { useSivoxStore } from "@/store/useSivoxStore";
import { GridCellComponent } from "@/components/GridCell";
import { QWERTY_ROWS, ALPHABETICAL_ROWS } from "@/lib/layouts";
import type { GridCell } from "@/types";

// Grid es puramente presentacional: solo refleja el scanState del store.

export function Grid() {
  const { scanState, predictions, settings } = useSivoxStore();

  const letterRows =
    settings.layout === "qwerty" ? QWERTY_ROWS : ALPHABETICAL_ROWS;

  // Fila 0: predicciones (10 slots fijos, rellena con espacios vacíos)
  const predictionRow: GridCell[] = Array.from({ length: 10 }, (_, i) => {
    const word = predictions[i];
    return word
      ? { id: `pred-${i}`, label: word, type: "prediction" as const, value: word }
      : { id: `pred-empty-${i}`, label: "", type: "prediction" as const };
  });

  const allRows: GridCell[][] = [predictionRow, ...letterRows];

  const activeRow = scanState.level !== "idle" ? scanState.activeRow : -1;
  const activeCell =
    scanState.level === "cell" ? scanState.activeCell : -1;

  return (
    <div className="flex flex-col gap-1 w-full" role="grid" aria-label="Teclado SIVOX">
      {allRows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
          role="row"
        >
          {row.map((cell, cellIdx) => (
            <GridCellComponent
              key={cell.id}
              cell={cell}
              isRowActive={activeRow === rowIdx}
              isCellActive={activeRow === rowIdx && activeCell === cellIdx}
              isPrediction={rowIdx === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
