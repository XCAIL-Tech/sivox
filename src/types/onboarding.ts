export type AgeRange = "child" | "adolescent" | "adult" | "senior";
export type Gender = "male" | "female" | "other";
export type ConfiguratorRole = "family" | "caregiver" | "professional" | "institution";

export interface OnboardingData {
  // Step 0 — TyC
  terms_accepted: boolean;
  privacy_accepted: boolean;
  research_opt_in: boolean;

  // Step 1 — Perfil del usuario del comunicador
  user_name: string;
  age_range: AgeRange | "";
  user_gender: Gender | "";
  configurator_role: ConfiguratorRole | "";

  // Ubicación
  country: string;           // código ISO (AR, MX, ES…)
  country_name: string;
  province: string;
  province_id: string;       // AR: ID numérico georef
  province_code: string;     // ISO 3166-2 (AR-B, MX-JAL…)
  district: string;          // municipio / ciudad
  district_id: string;       // AR: ID georef
  locality: string;          // AR: localidad (nivel 4)
  locality_id: string;       // AR: ID georef

  // Step 2 — Configuración inicial
  keyboard_layout: "qwerty" | "alphabetical";
  tts_voice_gender: "female" | "male";
}

export const EMPTY_ONBOARDING: OnboardingData = {
  terms_accepted: false,
  privacy_accepted: false,
  research_opt_in: false,
  user_name: "",
  age_range: "",
  user_gender: "",
  configurator_role: "",
  country: "",
  country_name: "",
  province: "",
  province_id: "",
  province_code: "",
  district: "",
  district_id: "",
  locality: "",
  locality_id: "",
  keyboard_layout: "qwerty",
  tts_voice_gender: "female",
};
