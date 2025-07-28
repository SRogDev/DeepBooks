"use client"

import { useState } from "react"
import { Flag, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Book } from "@/lib/stores/books-store"
import { motion } from "framer-motion"

interface ReportModalProps {
  book: Book
  isOpen: boolean
  onClose: () => void
}

const reportReasons = [
  { id: "copyright", label: "Violación de derechos de autor" },
  { id: "inappropriate", label: "Contenido inapropiado" },
  { id: "spam", label: "Spam o contenido irrelevante" },
  { id: "plagiarism", label: "Plagio" },
  { id: "other", label: "Otro" },
]

export function ReportModal({ book, isOpen, onClose }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) return

    setIsSubmitting(true)

    // Mock API call to moderation service
    // await fetch('/api/moderation/report', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     bookId: book.id,
    //     reason: selectedReason,
    //     description
    //   })
    // })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      setSelectedReason("")
      setDescription("")
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flag className="h-5 w-5 text-red-500" />
            <span>Reportar Libro</span>
          </DialogTitle>
          <DialogDescription>Reporta "{book.title}" si consideras que viola nuestras políticas</DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-4 py-8"
          >
            <div className="rounded-full bg-green-100 p-3">
              <AlertTriangle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Reporte enviado</h3>
              <p className="text-sm text-muted-foreground">
                Nuestro equipo revisará tu reporte en las próximas 24 horas
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Motivo del reporte</Label>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason} className="mt-2">
                {reportReasons.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id} className="text-sm">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción adicional (opcional)
              </Label>
              <Textarea
                id="description"
                placeholder="Proporciona más detalles sobre el problema..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? "Enviando..." : "Reportar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
