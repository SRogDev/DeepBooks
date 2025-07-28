"use client"

import { useState } from "react"
import { Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommunityFeed } from "@/components/comunidad/community-feed"
import { DailyChallengesModal } from "@/components/comunidad/daily-challenges-modal"
import { useChallengesStore } from "@/lib/stores/challenges-store"

export default function ComunidadPage() {
  const [showChallenges, setShowChallenges] = useState(false)
  const { hasUnclaimedRewards } = useChallengesStore()

  return (
    <div className="pb-4 lg:pb-0">
      <div className="sticky top-14 lg:top-0 z-40 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Comunidad</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChallenges(true)}
            className="flex items-center space-x-2 relative"
          >
            <Trophy className="h-4 w-4" />
            <span>Desafíos</span>
            {hasUnclaimedRewards && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
            )}
          </Button>
        </div>
      </div>
      <CommunityFeed />
      <DailyChallengesModal isOpen={showChallenges} onClose={() => setShowChallenges(false)} />
    </div>
  )
}
