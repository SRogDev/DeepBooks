import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { Architecture } from "@/components/landing/architecture"
import { Closing } from "@/components/landing/closing"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B10] text-white antialiased">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Architecture />
        <Closing />
      </main>
    </div>
  )
}
