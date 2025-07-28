import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface DailyChallenge {
  id: string
  title: string
  description: string
  icon: string
  pagesReward: number
  progress: number
  target: number
  completed: boolean
  type: "reading" | "community" | "discovery"
}

interface ChallengesState {
  dailyChallenges: DailyChallenge[]
  hasUnclaimedRewards: boolean
  setDailyChallenges: (challenges: DailyChallenge[]) => void
  updateProgress: (challengeId: string, progress: number) => void
  claimReward: (challengeId: string) => void
  checkUnclaimedRewards: () => void
}

export const useChallengesStore = create<ChallengesState>()(
  persist(
    (set, get) => ({
      dailyChallenges: [],
      hasUnclaimedRewards: false,
      setDailyChallenges: (challenges) => {
        set({ dailyChallenges: challenges })
        get().checkUnclaimedRewards()
      },
      updateProgress: (challengeId, progress) =>
        set((state) => {
          const updatedChallenges = state.dailyChallenges.map((challenge) =>
            challenge.id === challengeId
              ? {
                  ...challenge,
                  progress: Math.min(progress, challenge.target),
                  completed: progress >= challenge.target,
                }
              : challenge,
          )
          return { dailyChallenges: updatedChallenges }
        }),
      claimReward: (challengeId) =>
        set((state) => {
          const updatedChallenges = state.dailyChallenges.filter((challenge) => challenge.id !== challengeId)
          return { dailyChallenges: updatedChallenges }
        }),
      checkUnclaimedRewards: () => {
        const { dailyChallenges } = get()
        const hasUnclaimed = dailyChallenges.some((challenge) => challenge.completed)
        set({ hasUnclaimedRewards: hasUnclaimed })
      },
    }),
    {
      name: "challenges-storage",
    },
  ),
)
