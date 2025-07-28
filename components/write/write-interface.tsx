"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookPreview } from "./book-preview"
import { ImmersionToolbar } from "./immersion-toolbar"
import { BookForm } from "./book-form"
import { motion, AnimatePresence } from "framer-motion"

export function WriteInterface() {
  const [currentStep, setCurrentStep] = useState<"preview" | "loading" | "form">("preview")
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const handleDone = async () => {
    setCurrentStep("loading")

    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setCurrentStep("form")
  }

  return (
    <div className="h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentStep === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            {/* Header */}
            <div className="absolute top-0 right-0 z-50 p-4">
              <Button onClick={handleDone} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Done
              </Button>
            </div>

            {/* Book Preview */}
            <BookPreview selectedTool={selectedTool} />

            {/* Immersion Toolbar */}
            <ImmersionToolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />
          </motion.div>
        )}

        {currentStep === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Loader2 className="h-12 w-12 text-primary mx-auto" />
              </motion.div>
              <p className="text-lg font-medium">Procesando tu libro...</p>
              <p className="text-muted-foreground">Esto puede tomar unos momentos</p>
            </div>
          </motion.div>
        )}

        {currentStep === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            <BookForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
