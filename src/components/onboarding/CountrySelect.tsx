import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_COUNTRIES } from "@/lib/location";

interface Props {
  value: string;      // nombre del país
  onChange: (name: string, code: string) => void;
  disabled?: boolean;
}

function Flag({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      width={20} height={15} alt={code}
      className="w-5 h-[15px] object-cover rounded-sm shrink-0"
    />
  );
}

export function CountrySelect({ value, onChange, disabled = false }: Props) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_COUNTRIES.filter(c => c.hispanic);
    return ALL_COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [query]);

  const selected = ALL_COUNTRIES.find(c => c.name === value);

  function handleSelect(code: string, name: string) {
    setQuery(name);
    onChange(name, code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        {selected && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Flag code={selected.code} />
          </div>
        )}
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            if (!e.target.value) onChange("", "");
            setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          placeholder="Buscar país..."
          disabled={disabled}
          className={cn(
            "w-full h-11 rounded-xl border-2 border-slate-100 bg-white text-sm font-medium text-slate-700",
            "outline-none focus:border-sivox-400 transition-colors pr-8",
            selected ? "pl-10" : "pl-3",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50",
          )}
        />
        <ChevronDown className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform",
          open && "rotate-180",
        )} />
      </div>

      {open && !disabled && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border-2 border-slate-100 rounded-2xl shadow-xl max-h-56 overflow-y-auto">
          {filtered.length > 0 ? filtered.map(c => (
            <button
              key={c.code}
              type="button"
              onMouseDown={e => { e.preventDefault(); handleSelect(c.code, c.name); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sivox-50 transition-colors text-left"
            >
              <Flag code={c.code} />
              {c.name}
            </button>
          )) : (
            <div className="p-4 text-center text-xs text-slate-400">No se encontraron países</div>
          )}
        </div>
      )}
    </div>
  );
}
