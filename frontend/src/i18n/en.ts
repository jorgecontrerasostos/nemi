const en = {
  appName: "Nemi",
  endSession: "End Session",
  newSession: "Start New Session",
  studyGaps: "Study the gaps",
  inputPlaceholder: "Type your explanation...",
  sendButton: "Send",
  sessionComplete: "Session Complete",
  thinking: "Nemi is thinking…",
  errorMessage: "Something went wrong. Please try again.",
  langToggle: "ES",
  stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
  whatStudying: "What are you studying today?",
  inputSubline: "Type a topic, paste your notes, or snap a photo.",
  whichPart: (topic: string) => `Which part of ${topic} should we focus on?`,
  subtopicSubline: "Pick the area you want to explain. One at a time.",
  studyFullTopic: "Study the full topic instead",
  startSession: "Start Session",
  somethingElse: "Something else?",
  customSubtopicPlaceholder: "Type a specific subtopic…",
  feedbackHint: `Say "feedback" anytime to get your review`,
} as const;

export default en;
