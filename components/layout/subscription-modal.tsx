"use client"

import { Crown, Zap, Infinity } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSubscriptionStore } from "@/lib/stores/subscription-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { plans, currentPlan, setCurrentPlan } = useSubscriptionStore()

  const planIcons = {
    free: Crown,
    lite: Zap,
    hardcore: Infinity,
  }

  const handleUpgrade = (planId: string) => {
    setCurrentPlan(planId)
    onClose()
  }

  // Encontrar el plan con más características para determinar la altura
  const maxFeatures = Math.max(...plans.map((plan) => plan.features.length))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Elige tu Plan de Lectura</DialogTitle>
          <DialogDescription className="text-center">Desbloquea todo el potencial de PrismaBook</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-6 md:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = planIcons[plan.id as keyof typeof planIcons]
            const isCurrentPlan = plan.id === currentPlan

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col",
                    isCurrentPlan && "ring-2 ring-primary",
                    plan.id === "hardcore" && "border-purple-600",
                  )}
                >
                  {isCurrentPlan && <Badge className="absolute right-2 top-2 bg-primary">Actual</Badge>}

                  {plan.id === "hardcore" && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                  )}

                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="text-2xl font-bold">
                      {plan.price === 0 ? (
                        "Gratis"
                      ) : (
                        <>
                          <span className="text-3xl">${plan.price}</span>
                          <span className="text-sm text-muted-foreground">/mes</span>
                        </>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <ul className="space-y-3">
                        {Array.from({ length: maxFeatures }).map((_, featureIndex) => {
                          const feature = plan.features[featureIndex]
                          return (
                            <motion.li
                              key={featureIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + featureIndex * 0.05 }}
                              className="flex items-start space-x-2 text-sm min-h-[20px]"
                            >
                              {feature ? (
                                <>
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  <span>{feature}</span>
                                </>
                              ) : (
                                <div className="h-5 w-full" /> // Espacio vacío para mantener altura
                              )}
                            </motion.li>
                          )
                        })}
                      </ul>
                    </div>

                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrentPlan}
                      variant={plan.id === "hardcore" ? "default" : "outline"}
                      className={cn(
                        "w-full mt-auto",
                        plan.id === "hardcore" &&
                          "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                      )}
                    >
                      {isCurrentPlan ? "Plan Actual" : plan.price === 0 ? "Mantener Gratis" : "Actualizar"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Puedes cancelar en cualquier momento. Sin compromisos.
        </div>
      </DialogContent>
    </Dialog>
  )
}
