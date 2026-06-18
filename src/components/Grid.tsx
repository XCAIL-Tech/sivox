import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { useSivoxStore } from "@/store/useSivoxStore";
import { GridCellComponent } from "@/components/GridCell";
import { buildAllRows, buildSosRows } from "@/lib/layouts";
import type { GridCell } from "@/types";

export function Grid() {
  const { scanState, predictions, settings, row0Mode, isSos, sosConfirming } =
    useSivoxStore();

  const allRows = isSos
    ? buildSosRows(sosConfirming)
    : buildAllRows(predictions, settings.layout, row0Mode);

  const activeRow = scanState.level !== "idle" ? scanState.activeRow : -1;
  const activeCell = scanState.level === "cell" ? scanState.activeCell : -1;

  return (
    <div
      className={cn(
        "flex flex-col gap-1 w-full h-full",
        isSos && "ring-2 ring-destructive/60 rounded-xl p-1"
      )}
      role="grid"
      aria-label="Teclado SIVOX"
    >
      {allRows.map((row, rowIdx) => {
        const hasIndicator = row[0]?.type === "indicator";
        const contentCols = row
          .slice(hasIndicator ? 1 : 0)
          .reduce((sum, c) => sum + (c.span ?? 1), 0);
        const gridTemplate = hasIndicator
          ? `5rem repeat(${contentCols}, 1fr)`
          : `repeat(${contentCols}, 1fr)`;

        // Fila 0 y última fila: ~1/3 de altura de las filas de letras
        const isEdgeRow = rowIdx === 0 || rowIdx === allRows.length - 1;
        const rowFlex = isEdgeRow ? "0.4" : "1";

        return (
          <Fragment key={rowIdx}>
            <div
              className="grid gap-1 min-h-0"
              style={{ gridTemplateColumns: gridTemplate, flex: rowFlex }}
              role="row"
            >
              {row.map((cell: GridCell, cellIdx: number) => (
                <div
                  key={cell.id}
                  style={cell.span ? { gridColumn: `span ${cell.span}` } : undefined}
                  className="h-full"
                >
                  <GridCellComponent
                    cell={cell}
                    isRowActive={activeRow === rowIdx}
                    isCellActive={activeRow === rowIdx && activeCell === cellIdx}
                  />
                </div>
              ))}
            </div>

            {/* Separador visual entre fila de predicciones y filas de letras */}
            {rowIdx === 0 && (
              <div className="border-t border-border/25 shrink-0 mx-1" />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
