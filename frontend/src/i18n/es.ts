const es = {
  appName: "Nemi",
  endSession: "Terminar sesión",
  newSession: "Nueva sesión",
  studyGaps: "Estudiar las brechas",
  inputPlaceholder: "Escribe tu explicación...",
  sendButton: "Enviar",
  sessionComplete: "Sesión completa",
  thinking: "Nemi está pensando…",
  errorMessage: "Algo salió mal. Inténtalo de nuevo.",
  langToggle: "EN",
  stepOf: (step: number, total: number) => `Paso ${step} de ${total}`,
  whatStudying: "¿Qué estás estudiando hoy?",
  inputSubline: "Escribe un tema, pega tus apuntes o toma una foto.",
  whichPart: (topic: string) => `¿Qué parte de ${topic} quieres estudiar?`,
  subtopicSubline: "Elige el área que quieres explicar. Una a la vez.",
  studyFullTopic: "Estudiar el tema completo",
  startSession: "Iniciar sesión",
  somethingElse: "¿Algo más?",
  customSubtopicPlaceholder: "Escribe un subtema específico…",
  feedbackHint: `Di "feedback" cuando quieras tu evaluación`,
} as const;

export default es;
