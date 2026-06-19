import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { OnboardingData } from "@/types/onboarding";

export const TERMS_VERSION   = "2026-06-18";
export const PRIVACY_VERSION = "2026-06-18";

export interface UserProfile {
  email: string;
  name: string;
  profile_completed: boolean;
  user_name?: string;
  country?: string;
  country_name?: string;
  terms_accepted_at?: unknown;
  terms_version?: string;
  privacy_version?: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch {
    return null;
  }
}

export async function recordLegalConsent(
  uid: string,
  researchOptIn: boolean,
): Promise<void> {
  await setDoc(
    doc(db, "users", uid),
    {
      terms_accepted_at:   serverTimestamp(),
      terms_version:       TERMS_VERSION,
      privacy_accepted_at: serverTimestamp(),
      privacy_version:     PRIVACY_VERSION,
      research_opt_in:     researchOptIn,
    },
    { merge: true },
  );
}

export async function saveOnboardingProfile(
  uid: string,
  data: OnboardingData,
): Promise<void> {
  const territoryCode = buildTerritoryCode(
    data.country,
    data.province_code,
    data.district_id,
    data.locality_id,
  );

  await setDoc(
    doc(db, "users", uid),
    {
      // Perfil del usuario del comunicador
      user_name:          data.user_name.trim(),
      age_range:          data.age_range,
      user_gender:        data.user_gender || null,
      configurator_role:  data.configurator_role,

      // Ubicación
      country:            data.country,
      country_name:       data.country_name,
      province:           data.province,
      province_id:        data.province_id || null,
      province_code:      data.province_code || null,
      district:           data.district || null,
      district_id:        data.district_id || null,
      locality:           data.locality || null,
      locality_id:        data.locality_id || null,
      territory_code:     territoryCode,

      // Configuración SIVOX
      keyboard_layout:    data.keyboard_layout,
      tts_voice_gender:   data.tts_voice_gender,

      profile_completed:  true,
      updatedAt:          serverTimestamp(),
    },
    { merge: true },
  );
}

function buildTerritoryCode(
  countryCode: string,
  provinceCode?: string,
  municipalityId?: string,
  localityId?: string,
): string {
  if (!countryCode || !provinceCode) return countryCode ?? "";
  if (!municipalityId) return provinceCode;
  if (!localityId) return `${provinceCode}-${municipalityId}`;
  return `${provinceCode}-${municipalityId}-${localityId}`;
}
