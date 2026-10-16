import Link from "next/link"
import { ArrowRight, Github } from "lucide-react"
import { Reveal } from "./reveal"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B0B10] pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 0%, rgba(236,72,153,0.14), transparent 70%), radial-gradient(40% 30% at 85% 80%, rgba(236,72,153,0.06), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[13px] font-medium text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />
            Open-source generative reading engine
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl">
            Don&apos;t just read the book.
            <br />
            <span className="font-display italic font-medium text-[#EC4899]">Experience it.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Upload any book. Write creative guidelines in plain language. DeepBooks&apos; AI
            generates moments, scenes, and ambient experiences — grounded in the actual
            text via RAG, never hallucinated from thin air.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/biblioteca"
              className="group flex cursor-pointer items-center gap-2 rounded-xl bg-[#EC4899] px-6 py-3.5 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[#f472b6]"
            >
              Open the library
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className="cursor-pointer rounded-xl border border-white/15 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-white/30 hover:bg-white/5"
            >
              See how it works
            </Link>
            <Link
              href="https://github.com/SRogDev/DeepBooks"
              target="_blank"
              rel="noreferrer"
              className="flex cursor-pointer items-center gap-2 px-2 py-3.5 text-[15px] font-medium text-zinc-400 transition-colors duration-200 hover:text-white"
            >
              <Github className="h-4 w-4" />
              Star on GitHub
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.32}>
          <p className="mt-12 text-[13px] tracking-wide text-zinc-600">
            MIT licensed&nbsp;&nbsp;·&nbsp;&nbsp;Next.js&nbsp;&nbsp;·&nbsp;&nbsp;Supabase + pgvector&nbsp;&nbsp;·&nbsp;&nbsp;OpenRouter
          </p>
        </Reveal>
      </div>
    </section>
  )
}
