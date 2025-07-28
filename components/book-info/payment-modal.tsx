"use client"

import { useState } from "react"
import { CreditCard, Lock, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Book } from "@/lib/stores/books-store"
import { motion, AnimatePresence } from "framer-motion"

interface PaymentModalProps {
  book: Book
  isOpen: boolean
  onClose: () => void
}

export function PaymentModal({ book, isOpen, onClose }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setIsSuccess(true)

    // Cerrar modal después del éxito
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Comprar Libro</span>
          </DialogTitle>
          <DialogDescription>Completa tu compra de "{book.title}"</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-4 py-8"
            >
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">¡Compra exitosa!</h3>
                <p className="text-sm text-muted-foreground">El libro se ha agregado a tu biblioteca</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{book.title}</span>
                  <span className="font-bold text-primary">$9.99</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="card">Número de tarjeta</Label>
                  <Input id="card" placeholder="1234 5678 9012 3456" disabled={isProcessing} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="expiry">Vencimiento</Label>
                    <Input id="expiry" placeholder="MM/YY" disabled={isProcessing} />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" disabled={isProcessing} />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Pago seguro encriptado</span>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button onClick={handlePayment} disabled={isProcessing} className="flex-1">
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    "Pagar $9.99"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
