import { cn } from "@/lib/utils";
import type { GridCell as GridCellType, GridCellType as CellType } from "@/types";

interface GridCellProps {
  cell: GridCellType;
  isRowActive: boolean;
  isCellActive: boolean;
}

const SOS_OPTION_TYPES = new Set<CellType>([
  "sos-continue", "sos-cancel-init", "sos-confirm-cancel", "sos-confirm-continue",
]);

// Celdas de función — fondo azul oscuro para distinguirlas de las letras
const FUNCTION_TYPES = new Set<CellType>([
  "space", "speak", "backspace", "clear", "frases", "numeros", "sos", "back",
]);

export function GridCellComponent({ cell, isRowActive, isCellActive }: GridCellProps) {
  // ─── Celda indicadora — marcador visual de inicio de fila ─────────────────
  if (cell.type === "indicator") {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-full select-none",
          !isRowActive && "text-border/30",
          isRowActive && !isCellActive && "text-sivox-500/40",
          isCellActive && "text-sivox-500/80",
        )}
        aria-hidden="true"
      >
        <span className="text-2xl">▸</span>
      </div>
    );
  }

  // ─── Celdas de opciones SOS (durante alerta) ──────────────────────────────
  if (SOS_OPTION_TYPES.has(cell.type)) {
    const isCancelVariant =
      cell.type === "sos-cancel-init" || cell.type === "sos-confirm-cancel";

    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border-2 font-bold text-lg",
          "select-none transition-all duration-100 h-full",
          isCancelVariant
            ? "bg-red-500/15 border-red-500/60 text-red-300"
            : "bg-amber-500/15 border-amber-500/60 text-amber-300",
          isRowActive && !isCellActive && "scale-[1.02]",
          isCellActive && isCancelVariant &&
            "bg-red-500 border-red-400 text-white scale-105 shadow-lg shadow-red-500/50",
          isCellActive && !isCancelVariant &&
            "bg-amber-500 border-amber-400 text-white scale-105 shadow-lg shadow-amber-500/50",
        )}
        role="button"
        aria-label={cell.label}
      >
        <span className="text-center px-4">{cell.label}</span>
      </div>
    );
  }

  const isEmpty = !cell.label;

  // ─── Tamaño de fuente por tipo ────────────────────────────────────────────
  const fontSize =
    cell.type === "prediction" || cell.type === "frase"
      ? "text-xs"
      : cell.type === "frases" || cell.type === "numeros" || cell.type === "back"
      ? "text-[10px] font-bold leading-tight"
      : "text-lg"; // letras, funciones, puntuación, números, SOS

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-border",
        "font-semibold text-foreground select-none transition-all duration-100 h-full",
        fontSize,
        isEmpty
          ? "bg-transparent border-transparent"
          : FUNCTION_TYPES.has(cell.type)
          ? "bg-[#050d18]"   // azul oscuro casi negro para funciones
          : "bg-[var(--sivox-cell-inactive)]", // gris para letras y puntuación
        // Barrido de fila activa
        !isCellActive && isRowActive && !isEmpty &&
          "bg-[var(--sivox-scan-row)] scale-[1.02]",
        // Barrido de celda activa
        isCellActive &&
          "bg-[var(--sivox-scan-cell)] scale-105 shadow-lg shadow-sivox-500/40 z-10 border-sivox-500/60",
      )}
      role="button"
      aria-label={cell.label || undefined}
      aria-disabled={isEmpty}
    >
      <span
        className={cn(
          "text-center truncate px-0.5",
          (cell.type === "prediction" || cell.type === "frase") && "px-1",
          (cell.type === "frases" || cell.type === "back") && "px-1 leading-tight",
        )}
      >
        {cell.label}
      </span>
    </div>
  );
}
