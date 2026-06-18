import { useState, useEffect } from "react";
import { Baby, Smile, User, Users2, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountrySelect } from "./CountrySelect";
import { ArLocationSelect } from "./ArLocationSelect";
import {
  getProvinces, PROVINCES_BY_COUNTRY, ADMIN_LEVEL_1_LABELS, ADMIN_LEVEL_2_LABELS,
  ADMIN_LEVEL_3_LABELS, AR_INDEC_TO_ISO,
} from "@/lib/location";
import type { Province } from "@/lib/location";
import type { OnboardingData, AgeRange, Gender, ConfiguratorRole } from "@/types/onboarding";

interface Props {
  data: OnboardingData;
  onChange: (field: keyof OnboardingData, value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
}

const AGE_RANGES: { id: AgeRange; label: string; sub: string; icon: typeof Baby }[] = [
  { id: "child",      label: "Niño/a",       sub: "6–12 años",  icon: Baby },
  { id: "adolescent", label: "Adolescente",   sub: "13–17 años", icon: Smile },
  { id: "adult",      label: "Adulto/a",      sub: "18–59 años", icon: User },
  { id: "senior",     label: "Adulto mayor",  sub: "60+ años",   icon: Users2 },
];

const GENDERS: { id: Gender; label: string }[] = [
  { id: "male",   label: "Masculino" },
  { id: "female", label: "Femenino" },
  { id: "other",  label: "Prefiero no decir" },
];

const CONFIGURATOR_ROLES: { id: ConfiguratorRole; label: string; sub: string }[] = [
  { id: "family",      label: "Familiar o cuidador/a",       sub: "Madre, padre, tutora/r, familiar directo" },
  { id: "caregiver",   label: "Asistente personal",          sub: "Persona a cargo del acompañamiento diario" },
  { id: "professional",label: "Profesional de la salud",     sub: "Terapeuta, fonoaudiólogo/a, médico/a" },
  { id: "institution", label: "Institución, centro o escuela", sub: "Centro educativo, terapéutico u organización" },
];

export function StepProfile({ data, onChange, onNext, onBack }: Props) {
  const [arProvinces, setArProvinces] = useState<Province[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [provinceOpen, setProvinceOpen] = useState(false);
  const isAR = data.country === "AR";

  // Cargar provincias según país
  useEffect(() => {
    if (!data.country) { setArProvinces([]); return; }
    if (isAR) {
      setLoadingProvinces(true);
      getProvinces()
        .then(setArProvinces)
        .catch(() => setArProvinces([]))
        .finally(() => setLoadingProvinces(false));
    }
  }, [data.country]);

  function handleCountryChange(name: string, code: string) {
    onChange("country_name", name);
    onChange("country", code);
    onChange("province", "");
    onChange("province_id", "");
    onChange("province_code", "");
    onChange("district", "");
    onChange("district_id", "");
    onChange("locality", "");
    onChange("locality_id", "");
  }

  function handleProvinceSelectAR(provinceName: string) {
    const p = arProvinces.find(x => x.nombre === provinceName);
    onChange("province", provinceName);
    onChange("province_id", p?.id ?? "");
    onChange("province_code", p ? (AR_INDEC_TO_ISO[p.id] ?? "") : "");
    onChange("district", "");
    onChange("district_id", "");
    onChange("locality", "");
    onChange("locality_id", "");
    setProvinceOpen(false);
  }

  function handleProvinceSelectOther(provinceName: string) {
    onChange("province", provinceName);
    onChange("province_id", "");
    onChange("province_code", "");
    onChange("district", "");
    onChange("district_id", "");
    setProvinceOpen(false);
  }

  const provinceLabel = data.country ? (ADMIN_LEVEL_1_LABELS[data.country] ?? "Provincia / Estado") : "Provincia";
  const municipalityLabel = data.country ? (ADMIN_LEVEL_2_LABELS[data.country] ?? "Municipio / Ciudad") : "Municipio";
  const localityLabel = ADMIN_LEVEL_3_LABELS["AR"] ?? "Localidad / Barrio";

  const staticProvinces = data.country !== "AR" ? (PROVINCES_BY_COUNTRY[data.country] ?? []) : [];

  const hasLocation = isAR
    ? (!!data.country && !!data.province && !!data.district && !!data.locality)
    : (!!data.country && !!data.province && !!data.district);

  const isValid =
    data.user_name.trim().length >= 2 &&
    !!data.age_range &&
    !!data.configurator_role &&
    hasLocation;

  function handleNameChange(val: string) {
    if (/^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]{0,50}$/.test(val)) {
      onChange("user_name", val);
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
          Sobre quien usará SIVOX
        </h2>
        <p className="text-sm font-medium text-slate-500">
          Personalizamos la experiencia con esta información.
        </p>
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-sivox-500/5 border border-sivox-500/20 mt-3">
          <Info className="w-4 h-4 text-sivox-600 shrink-0 mt-0.5" />
          <p className="text-xs font-bold text-sivox-700 leading-relaxed">
            Esta información nos ayuda a entender la realidad de cada territorio
            y a mejorar los servicios disponibles para la comunidad.
          </p>
        </div>
      </div>

      {/* Nombre */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
          Nombre del usuario del comunicador <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.user_name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="¿Cómo se llama quien va a usar SIVOX?"
          className={cn(
            "w-full h-11 rounded-xl border-2 px-3 text-sm font-medium text-slate-700 outline-none transition-colors",
            data.user_name && data.user_name.trim().length < 2
              ? "border-red-300 focus:border-red-400"
              : "border-slate-100 focus:border-sivox-400",
          )}
        />
        {data.user_name && data.user_name.trim().length < 2 && (
          <p className="text-[10px] text-red-500 font-bold">Debe tener al menos 2 caracteres.</p>
        )}
      </div>

      {/* Franja etaria */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
          Franja etaria <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AGE_RANGES.map(({ id, label, sub, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange("age_range", id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all",
                data.age_range === id
                  ? "border-sivox-400 bg-sivox-50 shadow-md shadow-sivox-500/10"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm",
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                data.age_range === id ? "bg-sivox-100" : "bg-slate-50",
              )}>
                <Icon className={cn("w-5 h-5", data.age_range === id ? "text-sivox-600" : "text-slate-400")} />
              </div>
              <div>
                <div className={cn("text-xs font-black leading-tight", data.age_range === id ? "text-sivox-700" : "text-slate-700")}>
                  {label}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
          Ubicación <span className="text-red-400">*</span>
        </label>

        {/* País + Provincia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">País</span>
            <CountrySelect
              value={data.country_name}
              onChange={handleCountryChange}
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{provinceLabel}</span>
            {isAR ? (
              // AR: dropdown de provincias de georef.ar
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProvinceOpen(!provinceOpen)}
                  disabled={!data.country || loadingProvinces}
                  className={cn(
                    "w-full h-11 rounded-xl border-2 px-3 text-sm font-medium text-left flex items-center justify-between transition-all",
                    data.province ? "text-slate-700" : "text-slate-400",
                    !data.country ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed" : "border-slate-100 bg-white focus:border-sivox-400",
                  )}
                >
                  <span>{loadingProvinces ? "Cargando..." : (data.province || "Seleccionar")}</span>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", provinceOpen && "rotate-180")} />
                </button>
                {provinceOpen && arProvinces.length > 0 && (
                  <div className="absolute z-50 top-full mt-1 w-full bg-white border-2 border-slate-100 rounded-2xl shadow-xl max-h-56 overflow-y-auto">
                    {arProvinces.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseDown={e => { e.preventDefault(); handleProvinceSelectAR(p.nombre); }}
                        className={cn(
                          "w-full px-3 py-2.5 text-sm font-medium text-left hover:bg-sivox-50 transition-colors",
                          data.province === p.nombre ? "text-sivox-600 font-bold bg-sivox-50" : "text-slate-700",
                        )}
                      >
                        {p.nombre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Otros países: lista estática
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProvinceOpen(!provinceOpen)}
                  disabled={!data.country || staticProvinces.length === 0}
                  className={cn(
                    "w-full h-11 rounded-xl border-2 px-3 text-sm font-medium text-left flex items-center justify-between transition-all",
                    data.province ? "text-slate-700" : "text-slate-400",
                    (!data.country || staticProvinces.length === 0) ? "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed" : "border-slate-100 bg-white",
                  )}
                >
                  <span>{data.province || (data.country ? "Seleccionar" : "Seleccioná el país primero")}</span>
                  <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", provinceOpen && "rotate-180")} />
                </button>
                {provinceOpen && staticProvinces.length > 0 && (
                  <div className="absolute z-50 top-full mt-1 w-full bg-white border-2 border-slate-100 rounded-2xl shadow-xl max-h-56 overflow-y-auto">
                    {staticProvinces.map(p => (
                      <button
                        key={p}
                        type="button"
                        onMouseDown={e => { e.preventDefault(); handleProvinceSelectOther(p); }}
                        className={cn(
                          "w-full px-3 py-2.5 text-sm font-medium text-left hover:bg-sivox-50 transition-colors",
                          data.province === p ? "text-sivox-600 font-bold bg-sivox-50" : "text-slate-700",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Municipio / Ciudad */}
        <div className={cn("grid gap-3", isAR ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{municipalityLabel}</span>
            {isAR ? (
              <ArLocationSelect
                mode="municipality"
                value={data.district}
                onChange={(name, id) => {
                  onChange("district", name);
                  onChange("district_id", id);
                  onChange("locality", "");
                  onChange("locality_id", "");
                }}
                provinceId={data.province_id}
                placeholder="Ej: La Matanza, General Pueyrredón..."
                disabled={!data.province}
              />
            ) : (
              <input
                type="text"
                value={data.district}
                onChange={e => onChange("district", e.target.value)}
                placeholder="Ciudad o municipio..."
                disabled={!data.province}
                className={cn(
                  "w-full h-11 rounded-xl border-2 border-slate-100 px-3 text-sm font-medium text-slate-700",
                  "outline-none focus:border-sivox-400 transition-colors",
                  !data.province && "opacity-50 cursor-not-allowed bg-slate-50",
                )}
              />
            )}
          </div>

          {/* Localidad — solo AR */}
          {isAR && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{localityLabel}</span>
              <ArLocationSelect
                mode="locality"
                value={data.locality}
                onChange={(name, id) => { onChange("locality", name); onChange("locality_id", id); }}
                provinceId={data.province_id}
                municipalityId={data.district_id}
                placeholder="Ej: San Justo, Ramos Mejía..."
                disabled={!data.district}
              />
            </div>
          )}
        </div>
      </div>

      {/* Género — opcional */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
          Género{" "}
          <span className="text-[10px] font-bold text-slate-300 normal-case tracking-normal ml-1">
            (opcional — se usa para personalizar la voz TTS)
          </span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {GENDERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange("user_gender", data.user_gender === id ? "" : id)}
              className={cn(
                "h-9 px-4 rounded-full text-xs font-bold border-2 transition-all",
                data.user_gender === id
                  ? "border-sivox-400 bg-sivox-50 text-sivox-700"
                  : "border-slate-100 bg-white text-slate-600 hover:border-slate-200",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quien configura */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
          ¿Quién configura este perfil? <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONFIGURATOR_ROLES.map(({ id, label, sub }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange("configurator_role", id)}
              className={cn(
                "flex flex-col items-start gap-1 p-4 rounded-2xl border-2 text-left transition-all",
                data.configurator_role === id
                  ? "border-sivox-400 bg-sivox-50 shadow-md shadow-sivox-500/10"
                  : "border-slate-100 bg-white hover:border-slate-200",
              )}
            >
              <span className={cn(
                "text-sm font-black leading-tight",
                data.configurator_role === id ? "text-sivox-700" : "text-slate-700",
              )}>
                {label}
              </span>
              <span className="text-[11px] text-slate-400 font-medium leading-snug">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-6 rounded-full border-2 border-slate-100 text-sm font-black text-slate-600 hover:border-slate-200 transition-all active:scale-95"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className={cn(
            "flex-1 h-12 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300",
            isValid
              ? "bg-sivox-600 hover:bg-sivox-700 text-white shadow-lg shadow-sivox-600/20 hover:scale-[1.02] active:scale-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed",
          )}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
