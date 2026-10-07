import Link from "next/link"
import { ArrowRight, Github, BookOpen } from "lucide-react"
import { Reveal } from "./reveal"

export function Closing() {
  return (
    <>
      <section className="border-t border-white/10 bg-[#0B0B10] py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Bring a book.
              <br />
              <span className="font-display italic font-medium text-[#EC4899]">Leave with an experience.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Upload the first book, write your first pauta, and watch a static text turn
              into something that responds to how you read.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/biblioteca"
                className="group flex cursor-pointer items-center gap-2 rounded-xl bg-[#EC4899] px-6 py-3.5 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[#f472b6]"
              >
                Open the library
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/mercado"
                className="cursor-pointer rounded-xl border border-white/15 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors duration-200 hover:border-white/30 hover:bg-white/5"
              >
                Browse the mercado
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <footer className="border-t border-white/10 bg-[#0B0B10] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EC4899]">
              <BookOpen className="h-3.5 w-3.5 text-black" strokeWidth={2.5} />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">DeepBooks</div>
              <div className="text-xs text-zinc-500">New ways to experience books.</div>
            </div>
          </div>
          <p className="text-xs text-zinc-600">Open source (MIT) by SRogDev · No fake stats on this page.</p>
          <Link
            href="https://github.com/SRogDev/DeepBooks"
            target="_blank"
            rel="noreferrer"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:border-white/30 hover:text-white"
          >
            <Github className="h-4 w-4" />
            GitHub
          </Link>
        </div>
      </footer>
    </>
  )
}
