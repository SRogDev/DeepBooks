"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SellCard } from "./sell-card"
import { BenefitsCard } from "./benefits-card"
import { useWriterStore, type BookSales } from "@/lib/stores/writer-store"
import { motion } from "framer-motion"

const mockBookSales: BookSales[] = [
  {
    id: "book-1",
    title: "El Laberinto de los Sueños",
    cover: "/placeholder.svg?height=120&width=80",
    pagesRead: 15420,
    completionRate: 68,
    purchaseCount: 234,
    totalRevenue: 2106,
    status: "en-venta",
  },
  {
    id: "book-2",
    title: "Crónicas del Tiempo",
    cover: "/placeholder.svg?height=120&width=80",
    pagesRead: 8930,
    completionRate: 45,
    purchaseCount: 156,
    totalRevenue: 1404,
    status: "pendiente",
  },
  {
    id: "book-3",
    title: "Sombras Digitales",
    cover: "/placeholder.svg?height=120&width=80",
    pagesRead: 2340,
    completionRate: 23,
    purchaseCount: 67,
    totalRevenue: 603,
    status: "rechazado",
  },
]

export function WriterDashboard() {
  const { bookSales, setBookSales } = useWriterStore()
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    setBookSales(mockBookSales)
  }, [setBookSales])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".epub")) {
      alert("Error: Solo se aceptan archivos EPUB")
      return
    }

    // Redirigir a la página de escritura
    window.location.href = "/write"
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de Gestión</h1>
      </div>

      {/* Sales Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Mis Libros</h2>
        {bookSales.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <SellCard book={book} />
          </motion.div>
        ))}
      </div>

      {/* Benefits */}
      <BenefitsCard />

      {/* Floating Write Button */}
      <div className="fixed bottom-20 right-4 z-40">
        <div className="relative">
          <input
            type="file"
            accept=".epub"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button size="lg" className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
