import type { SivoxSettings } from "@/types";

export function speakText(text: string, settings: SivoxSettings): void {
  if (!text.trim()) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = settings.language === "es" ? "es-AR" : "en-US";
  utterance.rate = settings.ttsRate;
  utterance.pitch = settings.ttsPitch;

  if (settings.ttsVoice) {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.voiceURI === settings.ttsVoice);
    if (voice) utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);

  if (navigator.vibrate) {
    navigator.vibrate([30]);
  }
}

export function stopSpeaking(): void {
  window.speechSynthesis.cancel();
}

export function getAvailableVoices(language: "es" | "en"): SpeechSynthesisVoice[] {
  const langPrefix = language === "es" ? "es" : "en";
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.startsWith(langPrefix));
}
