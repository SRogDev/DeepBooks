"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface BookPreviewProps {
  selectedTool: string | null
}

export function BookPreview({ selectedTool }: BookPreviewProps) {
  const [immersionPoints, setImmersionPoints] = useState<
    Array<{
      id: string
      type: string
      x: number
      y: number
    }>
  >([])

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTool) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    const newPoint = {
      id: `point-${Date.now()}`,
      type: selectedTool,
      x,
      y,
    }

    setImmersionPoints([...immersionPoints, newPoint])
  }

  const getToolColor = (type: string) => {
    const colors = {
      imagen: "bg-blue-500",
      soundtrack: "bg-green-500",
      reflexion: "bg-purple-500",
      animate: "bg-orange-500",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500"
  }

  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 min-h-[600px] cursor-crosshair"
        onClick={handleClick}
      >
        {/* Mock book content */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center mb-8">Vista Previa del Libro</h1>
          <div className="space-y-4 text-justify leading-relaxed">
            <p>
              En el corazón de la ciudad antigua, donde las sombras danzan entre callejones empedrados y los secretos
              susurran desde cada rincón, comenzó una historia que cambiaría el destino de todos los que la escucharan.
            </p>
            <p>
              El protagonista, sin saberlo aún, estaba a punto de embarcarse en una aventura que pondría a prueba no
              solo su valentía, sino también su comprensión de la realidad misma.
            </p>
            <p>
              Mientras se preparaba para lo que creía sería una jornada ordinaria, fuerzas misteriosas ya habían puesto
              en marcha los engranajes del destino.
            </p>
          </div>
        </div>

        {/* Immersion Points */}
        {immersionPoints.map((point) => (
          <motion.div
            key={point.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`absolute w-4 h-4 rounded-full ${getToolColor(point.type)} border-2 border-white shadow-lg`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {selectedTool && (
          <div className="absolute top-4 left-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
            Modo: {selectedTool} - Haz clic para agregar
          </div>
        )}
      </motion.div>
    </div>
  )
}
