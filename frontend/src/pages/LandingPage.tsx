interface Props {
  onStart: () => void;
}

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-on-surface tracking-tight">
            <a href="/">Nemi AI</a>
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-on-surface-variant">
            <a
              href="#process"
              className="hover:text-on-surface transition-colors"
            >
              Process
            </a>
            <a
              href="#how-it-works"
              className="hover:text-on-surface transition-colors"
            >
              How It Works
            </a>
            <a
              href="#methodology"
              className="hover:text-on-surface transition-colors"
            >
              Methodology
            </a>
            <a
              href="#support"
              className="hover:text-on-surface transition-colors"
            >
              Support
            </a>
          </nav>
          <button
            onClick={onStart}
            className="bg-primary text-on-primary text-sm font-medium px-5 py-2.5 rounded-full min-h-[44px] btn-press cursor-pointer"
          >
            Start Session
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span
              className="material-symbols-outlined text-sm"
              aria-hidden="true"
            >
              school
            </span>
            Feynman Technique
          </div>
          <h1
            className="font-display font-bold text-on-surface leading-[1.1] mb-6"
            style={{ fontSize: "clamp(2.25rem, 4vw + 1rem, 3.5rem)" }}
          >
            Master any topic by teaching it.
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-lg">
            Nemi is your AI study companion that challenges you to explain
            concepts out loud. Gaps in your understanding surface fast — and you
            fix them for good.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-semibold px-7 py-4 rounded-full min-h-[44px] text-base btn-press cursor-pointer"
          >
            Start Learning
            <span
              className="material-symbols-outlined text-lg"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-surface-container-lowest rounded-3xl p-6 soft-lift-lg w-full max-w-sm border border-outline-variant">
            <div className="space-y-3">
              <div className="bg-surface-container-low rounded-2xl p-4 text-sm text-on-surface-variant">
                Can you explain gradient descent to me?
              </div>
              <div className="bg-primary text-on-primary rounded-2xl p-4 text-sm">
                Gradient descent is how a model learns by taking small steps
                downhill on an error landscape...
              </div>
              <div className="bg-surface-container-low rounded-2xl p-4 text-sm text-on-surface-variant">
                What determines the step size?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feynman Steps ── */}
      <section id="how-it-works" className="bg-surface-container-low py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-on-surface text-center mb-4">
            How It Works
          </h2>
          <p className="text-on-surface-variant text-center mb-12 max-w-xl mx-auto">
            Three steps based on the Feynman Technique — proven to lock
            knowledge in for good.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "topic",
                title: "Choose a topic",
                body: "Pick anything you're learning — from calculus to constitutional law. Broad topics get narrowed down together.",
              },
              {
                icon: "record_voice_over",
                title: "Explain it to Nemi",
                body: "Teach the concept back in your own words. Nemi listens, probes, and asks follow-up questions.",
              },
              {
                icon: "manage_search",
                title: "Review the gaps",
                body: "Get a structured breakdown of what you knew, what was shaky, and what to revisit.",
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-surface-container-lowest rounded-2xl p-7 border border-outline-variant card-hover soft-lift"
              >
                <span
                  className="material-symbols-outlined text-primary text-3xl mb-4 block"
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <h3 className="font-display font-semibold text-on-surface text-xl mb-2">
                  {title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feedback Preview ── */}
      <section
        id="methodology"
        className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12"
      >
        <div className="flex-1">
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant soft-lift-lg">
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-[0.08em] mb-4">
              Session Summary
            </p>
            <ul className="space-y-3 text-sm text-on-surface">
              <li className="flex items-start gap-2">
                <span aria-hidden="true">✅</span>
                <span>
                  Strong understanding of the basic concept and terminology.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true">⚠️</span>
                <span>
                  Shaky on why the learning rate matters at different scales.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true">❌</span>
                <span>
                  Missed the connection between loss landscape shape and
                  convergence speed.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span aria-hidden="true">📌</span>
                <span>
                  Review: saddle points, adaptive learning rates (Adam,
                  RMSProp).
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-display text-3xl font-bold text-on-surface mb-4">
            Feedback that actually helps.
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-6">
            After every session, Nemi gives you a structured breakdown — not a
            grade, but a map of your understanding.
          </p>
          <ul className="space-y-3">
            {[
              "Identifies exactly where your explanation broke down",
              "Separates strong understanding from surface-level familiarity",
              "Pins specific concepts to review before next time",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm text-on-surface"
              >
                <span
                  className="material-symbols-outlined text-primary text-lg"
                  aria-hidden="true"
                >
                  check_circle
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        id="process"
        className="bg-primary text-on-primary py-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to actually learn?
          </h2>
          <p className="text-inverse-primary opacity-80 mb-8 text-lg">
            Stop re-reading. Start teaching. Nemi helps you find out what you
            actually know.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-on-primary text-primary font-semibold px-8 py-4 rounded-full min-h-[44px] text-base btn-press cursor-pointer"
          >
            Start for Free
            <span
              className="material-symbols-outlined text-lg"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        id="support"
        className="bg-surface-container-lowest border-t border-outline-variant"
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display font-semibold text-on-surface">
            Nemi AI
          </span>
          <p className="text-xs text-on-surface-variant">
            © 2026 Nemi. Built for learners.
          </p>
          <nav className="hidden md:flex items-center gap-6 text-sm text-on-surface-variant">
            <a
              href="#how-it-works"
              className="hover:text-on-surface transition-colors"
            >
              How It Works
            </a>
            <a
              href="#methodology"
              className="hover:text-on-surface transition-colors"
            >
              Methodology
            </a>
            <a
              href="#support"
              className="hover:text-on-surface transition-colors"
            >
              Support
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
