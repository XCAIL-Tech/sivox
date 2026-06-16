import { cn } from "@/lib/utils";
import type { GridCell as GridCellType } from "@/types";

interface GridCellProps {
  cell: GridCellType;
  isRowActive: boolean;
  isCellActive: boolean;
  isPrediction?: boolean;
  isAction?: boolean;
}

export function GridCellComponent({
  cell,
  isRowActive,
  isCellActive,
  isPrediction = false,
  isAction = false,
}: GridCellProps) {
  const isEmpty = !cell.label;

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-border",
        "font-semibold text-foreground select-none transition-all duration-100",
        "min-h-0",
        // Tamaño de fuente según tipo
        isPrediction ? "text-xs" : isAction ? "text-base" : "text-lg",
        // Fondo base
        isEmpty
          ? "bg-transparent border-transparent"
          : isAction
          ? "bg-[var(--sivox-action-cell)]"
          : isPrediction
          ? "bg-secondary"
          : "bg-[var(--sivox-cell-inactive)]",
        // Barrido de fila activa (highlight sutil)
        !isCellActive && isRowActive && !isEmpty &&
          "bg-[var(--sivox-scan-row)] scale-[1.02]",
        // Barrido de celda activa (highlight fuerte)
        isCellActive &&
          "bg-[var(--sivox-scan-cell)] scale-105 shadow-lg shadow-sivox-500/40 z-10 border-sivox-500/60",
      )}
      role="button"
      aria-label={cell.label || undefined}
      aria-disabled={isEmpty}
    >
      <span className={cn("text-center truncate px-0.5", isPrediction && "px-1")}>
        {cell.label}
      </span>
    </div>
  );
}
