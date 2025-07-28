import { create } from "zustand"

export interface Immersion {
  id: string
  page: number
  type: "imagen" | "soundtrack" | "reflexion" | "animate"
  content: string
  position: { x: number; y: number }
}

export interface ImmersionContent {
  type: "imagen" | "soundtrack" | "reflexion" | "animate"
  content: string
  title?: string
}

interface ImmersionState {
  immersions: Immersion[]
  currentImmersion: ImmersionContent | null
  isLoading: boolean
  setImmersions: (immersions: Immersion[]) => void
  setCurrentImmersion: (immersion: ImmersionContent | null) => void
  setIsLoading: (loading: boolean) => void
  fetchImmersionContent: (immersion: Immersion) => Promise<void>
}

export const useImmersionStore = create<ImmersionState>((set, get) => ({
  immersions: [],
  currentImmersion: null,
  isLoading: false,
  setImmersions: (immersions) => set({ immersions }),
  setCurrentImmersion: (immersion) => set({ currentImmersion: immersion }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  fetchImmersionContent: async (immersion) => {
    set({ isLoading: true })

    // Mock fetch - En producción sería:
    // const response = await fetch('/api/immersion', {
    //   method: 'POST',
    //   body: JSON.stringify({ type: immersion.type, page: immersion.page })
    // })
    // const content = await response.json()

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockContent: Record<string, ImmersionContent> = {
      imagen: {
        type: "imagen",
        title: "Visualización del Capítulo",
        content: "/placeholder.svg?height=400&width=600",
      },
      soundtrack: {
        type: "soundtrack",
        content: "https://example.com/ambient-music.mp3",
      },
      reflexion: {
        type: "reflexion",
        title: "Reflexión del Momento",
        content:
          "Este pasaje nos invita a reflexionar sobre la naturaleza del tiempo y cómo nuestras decisiones moldean no solo nuestro presente, sino también las posibilidades infinitas del futuro. ¿Qué hubiera pasado si el protagonista hubiera elegido diferente?",
      },
      animate: {
        type: "animate",
        title: "Animación Inmersiva",
        content: "/placeholder.svg?height=400&width=600",
      },
    }

    set({
      currentImmersion: mockContent[immersion.type],
      isLoading: false,
    })
  },
}))
