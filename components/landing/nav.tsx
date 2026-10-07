import Link from "next/link"
import { BookOpen, Github, ArrowRight } from "lucide-react"

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#architecture", label: "Under the hood" },
  { href: "/mercado", label: "Mercado" },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0B0B10]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex cursor-pointer items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EC4899]">
            <BookOpen className="h-4 w-4 text-black" strokeWidth={2.5} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-white">DeepBooks</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="cursor-pointer text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/SRogDev/DeepBooks"
            target="_blank"
            rel="noreferrer"
            aria-label="DeepBooks on GitHub"
            className="cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="/biblioteca"
            className="group flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#EC4899] px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-[#f472b6]"
          >
            Open library
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
