import { cn } from "@/lib/utils";
import type { GridCell as GridCellType } from "@/types";

interface GridCellProps {
  cell: GridCellType;
  isRowActive: boolean;
  isCellActive: boolean;
  isPrediction?: boolean;
}

export function GridCellComponent({
  cell,
  isRowActive,
  isCellActive,
  isPrediction = false,
}: GridCellProps) {
  const isAction = ["backspace", "clear", "speak", "enter", "caps", "numbers"].includes(
    cell.type
  );

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-border",
        "text-sm font-semibold text-foreground select-none transition-all duration-100",
        "min-h-[44px]",
        // Fondo base
        isAction
          ? "bg-[var(--sivox-action-cell)]"
          : isPrediction
          ? "bg-secondary"
          : "bg-[var(--sivox-cell-inactive)]",
        // Barrido de fila activa
        isRowActive && !isCellActive && "bg-[var(--sivox-scan-row)] scale-[1.02]",
        // Barrido de celda activa
        isCellActive && "bg-[var(--sivox-scan-cell)] scale-105 shadow-lg shadow-sivox-500/40 z-10"
      )}
      role="button"
      aria-label={cell.label}
    >
      <span className={cn(isPrediction && "text-xs truncate px-1", "text-center")}>
        {cell.label}
      </span>
    </div>
  );
}
