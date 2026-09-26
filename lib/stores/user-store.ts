import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  isCreator: boolean
  stats: {
    posts: number
    fans: number
    following: number
    booksRead: number
    readingStreak: number
    totalReadingTime: number
  }
  settings: {
    darkMode: boolean
    notifications: boolean
    autoBookmark: boolean
  }
}

interface UserState {
  user: UserProfile | null
  pagesAvailable: number
  setUser: (user: UserProfile) => void
  toggleCreatorMode: () => void
  updateSettings: (settings: Partial<UserProfile["settings"]>) => void
  setPagesAvailable: (pages: number) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        id: "1",
        name: "Usuario Demo",
        email: "demo@deepbooks.app",
        avatar: "/placeholder.svg?height=100&width=100",
        isCreator: false,
        stats: {
          posts: 0,
          fans: 1250,
          following: 89,
          booksRead: 47,
          readingStreak: 12,
          totalReadingTime: 2340,
        },
        settings: {
          darkMode: false,
          notifications: true,
          autoBookmark: true,
        },
      },
      pagesAvailable: 150,
      setUser: (user) => set({ user }),
      toggleCreatorMode: () =>
        set((state) => ({
          user: state.user ? { ...state.user, isCreator: !state.user.isCreator } : null,
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                settings: { ...state.user.settings, ...newSettings },
              }
            : null,
        })),
      setPagesAvailable: (pages) => set({ pagesAvailable: pages }),
    }),
    {
      name: "user-storage",
    },
  ),
)
