import { cn } from "@/lib/utils";

interface SelectButtonProps {
  onSelect: () => void;
  isScanning: boolean;
}

export function SelectButton({ onSelect, isScanning }: SelectButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-3/5 mx-auto py-4 rounded-2xl font-bold text-lg tracking-wide",
        "bg-gradient-to-r from-xcail-purple to-sivox-500",
        "text-white shadow-lg shadow-sivox-500/30",
        "active:scale-95 transition-transform duration-75",
        "select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sivox-500",
        isScanning && "animate-pulse"
      )}
      aria-label={isScanning ? "Seleccionar" : "Iniciar barrido"}
      aria-pressed={isScanning}
    >
      {isScanning ? "● SELECCIONAR" : "▶ INICIAR"}
    </button>
  );
}
