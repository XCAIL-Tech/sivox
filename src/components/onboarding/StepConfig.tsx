import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "@/types/onboarding";

interface Props {
  data: OnboardingData;
  onChange: (field: keyof OnboardingData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
}

function speakPreview(gender: "female" | "male") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance("Hola, soy la voz de SIVOX.");
  utterance.lang = "es-AR";
  utterance.rate = 0.9;
  utterance.pitch = gender === "female" ? 1.1 : 0.85;

  const voices = window.speechSynthesis.getVoices();
  const esVoices = voices.filter(v => v.lang.startsWith("es"));
  if (esVoices.length > 0) {
    const match = gender === "female"
      ? esVoices.find(v => /female|mujer|paulina|mónica|conchita|luciana/i.test(v.name))
        ?? esVoices[0]
      : esVoices.find(v => /male|hombre|jorge|miguel|enrique/i.test(v.name))
        ?? esVoices[esVoices.length - 1];
    utterance.voice = match;
  }
  window.speechSynthesis.speak(utterance);
}

const QWERTY_PREVIEW = ["Q","W","E","R","T","Y","U","I","O","P"];
const ABC_PREVIEW    = ["A","B","C","D","E","F","G","H","I","J"];

export function StepConfig({ data, onChange, onNext, onBack, loading }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          Configuración inicial
        </h2>
        <p className="text-sm font-medium text-slate-500">
          Podés cambiar esto en cualquier momento desde el Sidebar.
        </p>
      </div>

      {/* Layout del teclado */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
          Distribución del teclado
        </label>
        <div className="grid grid-cols-2 gap-4">
          {(["qwerty", "alphabetical"] as const).map(layout => {
            const isActive = data.keyboard_layout === layout;
            const preview = layout === "qwerty" ? QWERTY_PREVIEW : ABC_PREVIEW;
            const label = layout === "qwerty" ? "QWERTY" : "Alfabético";
            const sub = layout === "qwerty"
              ? "Distribución estándar de teclado"
              : "Teclas ordenadas A → Z";
            return (
              <button
                key={layout}
                type="button"
                onClick={() => onChange("keyboard_layout", layout)}
                className={cn(
                  "flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all",
                  isActive
                    ? "border-sivox-400 bg-sivox-50 shadow-md shadow-sivox-500/10"
                    : "border-slate-100 bg-white hover:border-slate-200",
                )}
              >
                {/* Mini preview del teclado */}
                <div className="flex flex-wrap gap-1">
                  {preview.map(k => (
                    <div
                      key={k}
                      className={cn(
                        "w-6 h-6 rounded-md text-[10px] font-black flex items-center justify-center border",
                        isActive
                          ? "border-sivox-300 bg-white text-sivox-700"
                          : "border-slate-200 bg-slate-50 text-slate-500",
                      )}
                    >
                      {k}
                    </div>
                  ))}
                  <div className={cn(
                    "w-6 h-6 rounded-md text-[9px] font-black flex items-center justify-center border",
                    isActive ? "border-sivox-300 bg-sivox-100 text-sivox-600" : "border-slate-200 bg-slate-100 text-slate-400",
                  )}>
                    ...
                  </div>
                </div>
                <div>
                  <div className={cn("text-sm font-black", isActive ? "text-sivox-700" : "text-slate-700")}>{label}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voz TTS */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
          Voz del comunicador
        </label>
        <div className="grid grid-cols-2 gap-4">
          {([
            { id: "female" as const, label: "Femenina", emoji: "👩" },
            { id: "male"   as const, label: "Masculina", emoji: "👨" },
          ]).map(({ id, label, emoji }) => {
            const isActive = data.tts_voice_gender === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange("tts_voice_gender", id)}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all",
                  isActive
                    ? "border-sivox-400 bg-sivox-50 shadow-md shadow-sivox-500/10"
                    : "border-slate-100 bg-white hover:border-slate-200",
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl",
                  isActive ? "bg-sivox-100" : "bg-slate-50",
                )}>
                  {emoji}
                </div>
                <div className={cn("text-sm font-black", isActive ? "text-sivox-700" : "text-slate-700")}>
                  {label}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => speakPreview(data.tts_voice_gender)}
          className="flex items-center gap-2 h-9 px-4 rounded-full border-2 border-slate-100 hover:border-sivox-300 text-xs font-bold text-slate-600 hover:text-sivox-600 transition-all active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          Escuchar vista previa
        </button>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="h-12 px-6 rounded-full border-2 border-slate-100 text-sm font-black text-slate-600 hover:border-slate-200 transition-all active:scale-95 disabled:opacity-50"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className={cn(
            "flex-1 h-12 rounded-full font-black text-sm uppercase tracking-widest text-white transition-all duration-300",
            "bg-sivox-600 hover:bg-sivox-700 shadow-lg shadow-sivox-600/20",
            loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95",
          )}
        >
          {loading ? "Guardando..." : "Comenzar a usar SIVOX"}
        </button>
      </div>
    </div>
  );
}
