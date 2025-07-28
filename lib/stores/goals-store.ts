import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserGoals {
  reading: {
    target: number
    current: number
    unit: "pages" | "books"
  }
  writing: {
    target: number
    current: number
    unit: "stories" | "pages"
    isWriterMode: boolean
  }
  community: {
    target: number
    current: number
    unit: "superlikes"
  }
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  type: "reading" | "writing"
  unlockedAt: Date
  isNew: boolean
}

interface GoalsState {
  goals: UserGoals | null
  achievements: Achievement[]
  hasSetGoals: boolean
  setGoals: (goals: UserGoals) => void
  updateProgress: (type: keyof UserGoals, progress: number) => void
  addAchievement: (achievement: Omit<Achievement, "id" | "unlockedAt" | "isNew">) => void
  markAchievementAsViewed: (achievementId: string) => void
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: null,
      achievements: [],
      hasSetGoals: false,
      setGoals: (goals) => set({ goals, hasSetGoals: true }),
      updateProgress: (type, progress) =>
        set((state) => {
          if (!state.goals) return state
          const updatedGoals = {
            ...state.goals,
            [type]: {
              ...state.goals[type],
              current: Math.min(progress, state.goals[type].target),
            },
          }
          return { goals: updatedGoals }
        }),
      addAchievement: (achievement) => {
        const newAchievement: Achievement = {
          ...achievement,
          id: `achievement-${Date.now()}`,
          unlockedAt: new Date(),
          isNew: true,
        }
        set((state) => ({
          achievements: [newAchievement, ...state.achievements],
        }))
      },
      markAchievementAsViewed: (achievementId) =>
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === achievementId ? { ...achievement, isNew: false } : achievement,
          ),
        })),
    }),
    {
      name: "goals-storage",
    },
  ),
)
