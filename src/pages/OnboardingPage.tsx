import { useState } from "react";
import { Mic2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { recordLegalConsent, saveOnboardingProfile } from "@/lib/userProfile";
import { StepLegal } from "@/components/onboarding/StepLegal";
import { StepProfile } from "@/components/onboarding/StepProfile";
import { StepConfig } from "@/components/onboarding/StepConfig";
import { useSivoxStore } from "@/store/useSivoxStore";
import { EMPTY_ONBOARDING, type OnboardingData } from "@/types/onboarding";

const STEPS = ["Privacidad", "Perfil", "Configuración"];

export default function OnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateSettings = useSivoxStore(s => s.updateSettings);

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(EMPTY_ONBOARDING);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(field: keyof OnboardingData, value: unknown) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  async function handleFinish() {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      await recordLegalConsent(user.uid, data.research_opt_in);
      await saveOnboardingProfile(user.uid, data);

      // Aplicar configuración inicial al store local
      updateSettings({
        layout: data.keyboard_layout,
        ttsVoice: "",  // se determinará al montar el comunicador
      });

      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError((err as Error).message ?? "Error al guardar el perfil. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sivox-500/10 border border-sivox-500/20 flex items-center justify-center">
              <Mic2 className="w-4 h-4 text-sivox-500" />
            </div>
            <span className="font-bold text-base tracking-wide text-slate-800">SIVOX</span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-0.5">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i < step ? "bg-sivox-500" :
                    i === step ? "bg-sivox-500 ring-2 ring-sivox-200" :
                    "bg-slate-200"
                  }`} />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 hidden sm:block">
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-8 h-px mb-3 transition-all ${i < step ? "bg-sivox-400" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold">
              ⚠️ {error}
            </div>
          )}

          {step === 0 && (
            <StepLegal
              data={data}
              onChange={handleChange}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepProfile
              data={data}
              onChange={handleChange}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepConfig
              data={data}
              onChange={handleChange}
              onNext={handleFinish}
              onBack={() => setStep(1)}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
}
