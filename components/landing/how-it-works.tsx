import { Reveal } from "./reveal"

const steps = [
  {
    n: "01",
    title: "Ingest",
    body: "Drop in a PDF, EPUB, DOCX, or markdown. DeepBooks parses it into sections and chunks, embeds them with OpenRouter, and indexes everything in pgvector.",
  },
  {
    n: "02",
    title: "Direct",
    body: "Write pautas — creative guidelines in plain language. Tone, what to expand, what to visualize. They compile into the AI's system prompt for that book.",
  },
  {
    n: "03",
    title: "Generate",
    body: "Ask for anything mid-read: “visualize this scene”, “what was she feeling here?” Every generation is grounded in the book's text via RAG and saved to the book's Momentos gallery.",
  },
  {
    n: "04",
    title: "Ambient",
    body: "Or do nothing at all. The ambient engine surfaces moments at chapter boundaries and quiet pauses — at the intensity you choose: off, subtle, immersive.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/10 bg-[#0B0B10] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#EC4899]">How it works</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Four steps from file to <span className="font-display italic font-medium">living book</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="h-full">
              <div className="flex h-full flex-col bg-[#101016] p-7 transition-colors duration-200 hover:bg-[#14141c]">
                <span className="font-serif text-4xl italic text-[#EC4899]/80">{s.n}</span>
                <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
