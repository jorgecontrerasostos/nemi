import en from "./en.ts";
import es from "./es.ts";

export type Language = "en" | "es";

export interface Translations {
  appName: string;
  endSession: string;
  newSession: string;
  studyGaps: string;
  inputPlaceholder: string;
  sendButton: string;
  sessionComplete: string;
  thinking: string;
  errorMessage: string;
  langToggle: string;
  stepOf: (step: number, total: number) => string;
  whatStudying: string;
  inputSubline: string;
  whichPart: (topic: string) => string;
  subtopicSubline: string;
  studyFullTopic: string;
  startSession: string;
  somethingElse: string;
  customSubtopicPlaceholder: string;
  feedbackHint: string;
}

const translations: Record<Language, Translations> = { en, es };

export function useTranslation(language: Language): Translations {
  return translations[language];
}
