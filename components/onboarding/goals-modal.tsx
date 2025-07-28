"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, Target, PenTool, Heart } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { useGoalsStore, type UserGoals } from "@/lib/stores/goals-store"
import { motion, AnimatePresence } from "framer-motion"

interface GoalsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GoalsModal({ isOpen, onClose }: GoalsModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [goals, setGoals] = useState<UserGoals>({
    reading: { target: 100, current: 0, unit: "pages" },
    writing: { target: 0, current: 0, unit: "stories", isWriterMode: false },
    community: { target: 50, current: 0, unit: "superlikes" },
  })
  const { setGoals: saveGoals } = useGoalsStore()

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      saveGoals(goals)
      onClose()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateGoal = (type: keyof UserGoals, field: string, value: any) => {
    setGoals((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }))
  }

  const steps = [
    {
      title: "Meta de Lectura",
      description: "¿Cuánto planeas leer?",
      icon: Target,
      color: "text-blue-500",
    },
    {
      title: "Meta de Escritura",
      description: "¿Planeas escribir contenido?",
      icon: PenTool,
      color: "text-purple-500",
    },
    {
      title: "Meta en Comunidad",
      description: "¿Cuántos superlikes esperas ganar?",
      icon: Heart,
      color: "text-pink-500",
    },
  ]

  const currentStepData = steps[currentStep - 1]
  const Icon = currentStepData.icon

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${currentStepData.color}`} />
            <span>{currentStepData.title}</span>
          </DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index + 1 <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Reading Goal */}
            {currentStep === 1 && (
              <motion.div
                key="reading"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label>Unidad de medida</Label>
                      <RadioGroup
                        value={goals.reading.unit}
                        onValueChange={(value) => updateGoal("reading", "unit", value)}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pages" id="pages" />
                          <Label htmlFor="pages">Páginas por día</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="books" id="books" />
                          <Label htmlFor="books">Libros por mes</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="reading-target">
                        Meta ({goals.reading.unit === "pages" ? "páginas/día" : "libros/mes"})
                      </Label>
                      <Input
                        id="reading-target"
                        type="number"
                        value={goals.reading.target}
                        onChange={(e) => updateGoal("reading", "target", Number.parseInt(e.target.value) || 0)}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Writing Goal */}
            {currentStep === 2 && (
              <motion.div
                key="writing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label>¿Planeas escribir?</Label>
                      <RadioGroup
                        value={goals.writing.isWriterMode ? "yes" : "no"}
                        onValueChange={(value) => {
                          const isWriter = value === "yes"
                          updateGoal("writing", "isWriterMode", isWriter)
                          if (!isWriter) updateGoal("writing", "target", 0)
                        }}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="writer-yes" />
                          <Label htmlFor="writer-yes">Sí, quiero escribir</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="writer-no" />
                          <Label htmlFor="writer-no">Solo leo</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {goals.writing.isWriterMode && (
                      <>
                        <div>
                          <Label>Unidad de medida</Label>
                          <RadioGroup
                            value={goals.writing.unit}
                            onValueChange={(value) => updateGoal("writing", "unit", value)}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="stories" id="stories" />
                              <Label htmlFor="stories">Historias por mes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pages" id="writing-pages" />
                              <Label htmlFor="writing-pages">Páginas por día</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <Label htmlFor="writing-target">
                            Meta ({goals.writing.unit === "stories" ? "historias/mes" : "páginas/día"})
                          </Label>
                          <Input
                            id="writing-target"
                            type="number"
                            value={goals.writing.target}
                            onChange={(e) => updateGoal("writing", "target", Number.parseInt(e.target.value) || 0)}
                            className="mt-2"
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Community Goal */}
            {currentStep === 3 && (
              <motion.div
                key="community"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="community-target">Superlikes por mes</Label>
                      <Input
                        id="community-target"
                        type="number"
                        value={goals.community.target}
                        onChange={(e) => updateGoal("community", "target", Number.parseInt(e.target.value) || 0)}
                        className="mt-2"
                        placeholder="¿Cuántos superlikes esperas ganar?"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Los superlikes se ganan cuando tu contenido realmente conecta con la comunidad
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="bg-transparent">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Atrás
            </Button>
            <Button onClick={handleNext}>
              {currentStep === 3 ? "Finalizar" : "Siguiente"}
              {currentStep < 3 && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
