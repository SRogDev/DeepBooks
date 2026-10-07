import { Reveal } from "./reveal"

const pipeline = ["Parse", "Chunk", "Embed", "Retrieve", "Generate"]
const pipelineDetail = [
  "sections detected",
  "semantic splits",
  "OpenRouter embeddings",
  "pgvector match_chunks",
  "RAG-grounded output",
]
const stack = ["Next.js 16", "React 19", "TypeScript", "Supabase Postgres", "pgvector", "Supabase Auth", "Supabase Storage", "OpenRouter"]

export function Architecture() {
  return (
    <section id="architecture" className="border-t border-white/10 bg-[#0B0B10] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#EC4899]">Under the hood</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Built in the open. <span className="font-display italic font-medium">Boring where it counts.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            No black boxes. Every prompt is a markdown file in the repo, every trigger is a
            policy you can read, every retrieval is a SQL function you can inspect.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9">
            <div className="flex flex-wrap items-center gap-y-4">
              {pipeline.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="text-center">
                    <div className="text-[15px] font-semibold text-white">{step}</div>
                    <div className="mt-1 text-[13px] text-zinc-500">{pipelineDetail[i]}</div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <div aria-hidden className="mx-4 h-px w-8 bg-[#EC4899]/50 sm:mx-6 sm:w-12" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[13px] font-medium text-zinc-300"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
