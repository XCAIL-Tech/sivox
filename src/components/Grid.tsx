import { useSivoxStore } from "@/store/useSivoxStore";
import { GridCellComponent } from "@/components/GridCell";
import { buildAllRows } from "@/lib/layouts";
import type { GridCell } from "@/types";

// Grid es puramente presentacional: refleja el scanState del store.
// buildAllRows garantiza que la estructura visual es idéntica a la del scanner.
export function Grid() {
  const { scanState, predictions, settings } = useSivoxStore();

  const allRows = buildAllRows(predictions, settings.layout);

  const activeRow = scanState.level !== "idle" ? scanState.activeRow : -1;
  const activeCell = scanState.level === "cell" ? scanState.activeCell : -1;

  return (
    <div className="flex flex-col gap-1 w-full h-full" role="grid" aria-label="Teclado SIVOX">
      {allRows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-1 flex-1"
          style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
          role="row"
        >
          {row.map((cell: GridCell, cellIdx: number) => (
            <GridCellComponent
              key={cell.id}
              cell={cell}
              isRowActive={activeRow === rowIdx}
              isCellActive={activeRow === rowIdx && activeCell === cellIdx}
              isPrediction={rowIdx === 0}
              isAction={rowIdx === 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
