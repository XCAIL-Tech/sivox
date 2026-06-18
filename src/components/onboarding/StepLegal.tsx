import { Shield, FileText, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingData } from "@/types/onboarding";

interface Props {
  data: OnboardingData;
  onChange: (field: keyof OnboardingData, value: unknown) => void;
  onNext: () => void;
}

export function StepLegal({ data, onChange, onNext }: Props) {
  const isValid = data.terms_accepted && data.privacy_accepted;

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-sivox-500/10 border border-sivox-500/20 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-sivox-500" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          Antes de comenzar
        </h2>
        <p className="text-sm font-medium text-slate-500 leading-relaxed">
          Para usar SIVOX necesitamos que aceptes nuestros documentos legales.
          Tu privacidad es nuestra prioridad.
        </p>
      </div>

      <div className="space-y-3">

        {/* Términos y condiciones */}
        <label className={cn(
          "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
          data.terms_accepted
            ? "border-sivox-400 bg-sivox-50"
            : "border-slate-100 bg-white hover:border-slate-200",
        )}>
          <input
            type="checkbox"
            checked={data.terms_accepted}
            onChange={e => onChange("terms_accepted", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-sivox-600 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-sivox-600 shrink-0" />
              <span className="text-sm font-black text-slate-700">
                Términos y Condiciones <span className="text-red-400">*</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Acepto los{" "}
              <a href="/terminos" target="_blank" rel="noopener noreferrer"
                className="text-sivox-600 font-bold hover:underline"
                onClick={e => e.stopPropagation()}
              >
                Términos y Condiciones
              </a>
              {" "}de uso de SIVOX, incluyendo las políticas de uso aceptable
              y las condiciones del servicio.
            </p>
          </div>
        </label>

        {/* Política de privacidad */}
        <label className={cn(
          "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
          data.privacy_accepted
            ? "border-sivox-400 bg-sivox-50"
            : "border-slate-100 bg-white hover:border-slate-200",
        )}>
          <input
            type="checkbox"
            checked={data.privacy_accepted}
            onChange={e => onChange("privacy_accepted", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-sivox-600 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-sivox-600 shrink-0" />
              <span className="text-sm font-black text-slate-700">
                Política de Privacidad <span className="text-red-400">*</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Acepto la{" "}
              <a href="/privacidad" target="_blank" rel="noopener noreferrer"
                className="text-sivox-600 font-bold hover:underline"
                onClick={e => e.stopPropagation()}
              >
                Política de Privacidad
              </a>
              {" "}de XCAIL Technologies. Los datos del perfil se usan para
              mejorar el servicio y no se comparten con terceros sin consentimiento.
            </p>
          </div>
        </label>

        {/* Investigación — opcional */}
        <label className={cn(
          "flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
          data.research_opt_in
            ? "border-violet-300 bg-violet-50"
            : "border-slate-100 bg-white hover:border-slate-200",
        )}>
          <input
            type="checkbox"
            checked={data.research_opt_in}
            onChange={e => onChange("research_opt_in", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-violet-600 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-violet-600 shrink-0" />
              <span className="text-sm font-black text-slate-700">
                Contribuir a la investigación{" "}
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                  Opcional
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Acepto que mis datos anonimizados sean utilizados para estudios
              sobre comunicación aumentativa en Latinoamérica. Podés revocar
              este consentimiento en cualquier momento desde la configuración.
            </p>
          </div>
        </label>
      </div>

      <p className="text-[10px] text-slate-400 text-center">
        Los campos marcados con <span className="text-red-400 font-bold">*</span> son obligatorios
      </p>

      <button
        onClick={onNext}
        disabled={!isValid}
        className={cn(
          "w-full h-12 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300",
          isValid
            ? "bg-sivox-600 hover:bg-sivox-700 text-white shadow-lg shadow-sivox-600/20 hover:scale-[1.02] active:scale-95"
            : "bg-slate-100 text-slate-400 cursor-not-allowed",
        )}
      >
        Continuar
      </button>
    </div>
  );
}
