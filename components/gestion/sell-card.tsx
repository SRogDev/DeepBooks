"use client"

import Image from "next/image"
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { BookSales } from "@/lib/stores/writer-store"
import { motion } from "framer-motion"

interface SellCardProps {
  book: BookSales
}

const statusConfig = {
  "en-venta": { label: "En Venta", color: "bg-green-500", textColor: "text-green-700" },
  pendiente: { label: "Pendiente", color: "bg-yellow-500", textColor: "text-yellow-700" },
  rechazado: { label: "Rechazado", color: "bg-red-500", textColor: "text-red-700" },
}

export function SellCard({ book }: SellCardProps) {
  const status = statusConfig[book.status]

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-12 flex-shrink-0">
            <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="rounded object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${status.color}`} />
                <Badge variant="secondary" className={status.textColor}>
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"
          >
            <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <div className="text-lg font-semibold">{book.pagesRead.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Páginas leídas</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
          >
            <Users className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <div className="text-lg font-semibold">{book.completionRate}%</div>
            <div className="text-xs text-muted-foreground">Completado</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20"
          >
            <ShoppingCart className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <div className="text-lg font-semibold">{book.purchaseCount}</div>
            <div className="text-xs text-muted-foreground">Compras</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20"
          >
            <DollarSign className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <div className="text-lg font-semibold">${book.totalRevenue}</div>
            <div className="text-xs text-muted-foreground">Ingresos</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
