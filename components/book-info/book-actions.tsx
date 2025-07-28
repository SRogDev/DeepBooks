"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"

interface BookActionsProps {
  onFreeRead: () => void
  onPurchase: () => void
}

export function BookActions({ onFreeRead, onPurchase }: BookActionsProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="flex space-x-4"
    >
      <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
        <Button
          variant="outline"
          size="lg"
          onClick={onFreeRead}
          className="w-full border-primary text-primary hover:bg-primary/5 bg-transparent"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Free
        </Button>
      </motion.div>

      <motion.div className="flex-1" whileTap={{ scale: 0.98 }}>
        <Button size="lg" onClick={onPurchase} className="w-full bg-primary hover:bg-primary/90">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Comprar
        </Button>
      </motion.div>
    </motion.div>
  )
}
