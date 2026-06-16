import { cn } from "@/lib/utils";
import { useSivoxStore } from "@/store/useSivoxStore";

interface SelectButtonProps {
  onSelect: () => void;
}

export function SelectButton({ onSelect }: SelectButtonProps) {
  const { isScanning, stopScanning } = useSivoxStore();

  return (
    <div className="flex items-center gap-2 w-full px-2">
      {/* Botón principal — 🔑 único punto de interacción del usuario */}
      <button
        onClick={onSelect}
        className={cn(
          "flex-1 py-4 rounded-2xl font-bold text-lg tracking-wide transition-all duration-150",
          "select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sivox-500",
          "active:scale-95",
          isScanning
            ? "bg-sivox-500 text-background shadow-lg shadow-sivox-500/40"
            : "bg-gradient-to-r from-xcail-purple to-sivox-500 text-white shadow-md"
        )}
        aria-label={isScanning ? "Seleccionar elemento activo" : "Iniciar barrido"}
        aria-pressed={isScanning}
      >
        {isScanning ? "● SELECCIONAR" : "▶ INICIAR"}
      </button>

      {/* Botón detener — para operador/cuidador */}
      <button
        onClick={stopScanning}
        disabled={!isScanning}
        className={cn(
          "py-4 px-5 rounded-2xl font-bold text-sm transition-all duration-150",
          "select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
          "active:scale-95",
          isScanning
            ? "bg-destructive text-white shadow-md cursor-pointer"
            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
        )}
        aria-label="Detener barrido"
      >
        ⏹
      </button>
    </div>
  );
}
