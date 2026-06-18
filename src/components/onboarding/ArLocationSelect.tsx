import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  searchMunicipalities,
  searchLocalities,
  searchLocalitiesByMunicipality,
} from "@/lib/location";
import type { Municipality } from "@/lib/location";

interface Props {
  mode: "municipality" | "locality";
  value: string;
  onChange: (name: string, id: string) => void;
  provinceId: string;
  municipalityId?: string;  // para locality, filtrar por municipio
  placeholder?: string;
  disabled?: boolean;
}

export function ArLocationSelect({
  mode,
  value,
  onChange,
  provinceId,
  municipalityId,
  placeholder = "Escribí para buscar...",
  disabled = false,
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isSelecting = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  // Limpiar cuando cambia el contexto
  useEffect(() => {
    if (!isSelecting.current) {
      setQuery("");
      setResults([]);
    }
    isSelecting.current = false;
  }, [provinceId, municipalityId]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (disabled || !provinceId) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        let data: Municipality[];
        if (mode === "municipality") {
          data = await searchMunicipalities(query, provinceId);
        } else if (municipalityId) {
          data = await searchLocalitiesByMunicipality(query, provinceId, municipalityId);
        } else {
          data = await searchLocalities(query, provinceId);
        }
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, provinceId, municipalityId, mode, disabled]);

  function handleSelect(item: Municipality) {
    isSelecting.current = true;
    setQuery(item.nombre);
    onChange(item.nombre, item.id);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={disabled ? "" : query}
          onChange={e => { setQuery(e.target.value); setOpen(true); onChange(e.target.value, ""); }}
          onFocus={() => { if (!disabled && provinceId) setOpen(true); }}
          placeholder={disabled ? "Seleccioná primero la provincia" : placeholder}
          disabled={disabled}
          className={cn(
            "w-full h-11 rounded-xl border-2 border-slate-100 bg-white text-sm font-medium text-slate-700",
            "outline-none focus:border-sivox-400 transition-colors px-3 pr-8",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50",
          )}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />
        )}
      </div>

      {open && !disabled && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border-2 border-slate-100 rounded-2xl shadow-xl max-h-56 overflow-y-auto">
          {results.length > 0 ? results.map((item, i) => (
            <button
              key={`${item.id}-${i}`}
              type="button"
              onMouseDown={e => { e.preventDefault(); handleSelect(item); }}
              className="w-full flex flex-col px-3 py-2.5 text-left hover:bg-sivox-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700">{item.nombre}</span>
              {item.provincia?.nombre && (
                <span className="text-xs text-slate-400">{item.provincia.nombre}</span>
              )}
            </button>
          )) : (
            <div className="p-4 text-center text-xs text-slate-400">
              {loading ? "Buscando..." : "No se encontraron resultados"}
            </div>
          )}
        </div>
      )}

      <p className="mt-1 text-[10px] text-slate-400 px-1">
        Podés escribir libremente o seleccionar de la lista
      </p>
    </div>
  );
}
