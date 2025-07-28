import { create } from "zustand"

export interface DailyAchievement {
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

interface AchievementsState {
  dailyAchievements: DailyAchievement[]
  setDailyAchievements: (achievements: DailyAchievement[]) => void
  updateProgress: (achievementId: string, progress: number) => void
}

export const useAchievementsStore = create<AchievementsState>((set) => ({
  dailyAchievements: [],
  setDailyAchievements: (achievements) => set({ dailyAchievements: achievements }),
  updateProgress: (achievementId, progress) =>
    set((state) => ({
      dailyAchievements: state.dailyAchievements.map((achievement) =>
        achievement.id === achievementId
          ? {
              ...achievement,
              progress: Math.min(progress, achievement.target),
              completed: progress >= achievement.target,
            }
          : achievement,
      ),
    })),
}))
