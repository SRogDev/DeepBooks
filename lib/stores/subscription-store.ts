import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  features: string[]
  isActive: boolean
  color: string
}

interface SubscriptionState {
  currentPlan: string
  plans: SubscriptionPlan[]
  setCurrentPlan: (planId: string) => void
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      currentPlan: "free",
      plans: [
        {
          id: "free",
          name: "Free",
          price: 0,
          features: ["150 páginas mensuales", "Acceso a libros gratuitos", "Biblioteca personal", "Modo oscuro"],
          isActive: true,
          color: "border-gray-200",
        },
        {
          id: "lite",
          name: "Lite",
          price: 4.99,
          features: [
            "500 páginas mensuales",
            "Acceso a catálogo premium",
            "Sin anuncios",
            "Descarga offline",
            "Estadísticas avanzadas",
          ],
          isActive: false,
          color: "border-primary",
        },
        {
          id: "hardcore",
          name: "Hardcore",
          price: 9.99,
          features: [
            "Páginas ilimitadas",
            "Acceso completo al catálogo",
            "Lanzamientos exclusivos",
            "Modo creador avanzado",
            "Soporte prioritario",
            "Badges especiales",
          ],
          isActive: false,
          color: "border-purple-600",
        },
      ],
      setCurrentPlan: (planId) =>
        set((state) => ({
          currentPlan: planId,
          plans: state.plans.map((plan) => ({
            ...plan,
            isActive: plan.id === planId,
          })),
        })),
    }),
    {
      name: "subscription-storage",
    },
  ),
)
