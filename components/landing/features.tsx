import { SlidersHorizontal, Images, Waves, BookOpen, Store, Code2 } from "lucide-react"
import { Reveal } from "./reveal"

const features = [
  {
    icon: SlidersHorizontal,
    title: "Pautas editor",
    body: "Direct the AI like a film director. Natural-language creative guidelines, per book, compiled into system prompts.",
  },
  {
    icon: Images,
    title: "Momentos gallery",
    body: "Every generation kept: expanded scenes, what-ifs, visualizations — a gallery attached to each book you own.",
  },
  {
    icon: Waves,
    title: "Ambient engine",
    body: "Boundary, idle, and cooldown triggers enforced server-side. Moments arrive on their own; they never interrupt.",
  },
  {
    icon: BookOpen,
    title: "Position-aware reader",
    body: "Table of contents, reading position, and non-blocking moment cards woven directly into the page.",
  },
  {
    icon: Store,
    title: "Mercado",
    body: "Publish a book together with its pautas. Acquire other readers' editions. Free exchange in the MVP.",
  },
  {
    icon: Code2,
    title: "100% open source",
    body: "MIT licensed. The RAG pipeline, the prompts, the trigger policy — all readable, all forkable on GitHub.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-white/10 bg-[#0B0B10] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#EC4899]">What it does</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            A reading experience with <span className="font-display italic font-medium">a director&apos;s chair</span>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-200 hover:border-[#EC4899]/40 hover:bg-white/[0.05]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EC4899]/15 transition-colors duration-200 group-hover:bg-[#EC4899]/25">
                  <f.icon className="h-5 w-5 text-[#EC4899]" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-400">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
