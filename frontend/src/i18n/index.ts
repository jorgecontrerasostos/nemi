import en from "./en.ts";
import es from "./es.ts";

export type Language = "en" | "es";

export interface Translations {
  appName: string;
  endSession: string;
  newSession: string;
  inputPlaceholder: string;
  sendButton: string;
  sessionComplete: string;
  thinking: string;
  errorMessage: string;
  langToggle: string;
}

const translations: Record<Language, Translations> = { en, es };

export function useTranslation(language: Language): Translations {
  return translations[language];
}
