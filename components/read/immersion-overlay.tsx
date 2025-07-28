"use client"

import { useState } from "react"
import { ImageIcon, Music, MessageCircle, Sparkles } from "lucide-react"
import { useImmersionStore } from "@/lib/stores/immersion-store"
import { ImmersionModal } from "./immersion-modal"
import { motion, AnimatePresence } from "framer-motion"

const immersionIcons = {
  imagen: ImageIcon,
  soundtrack: Music,
  reflexion: MessageCircle,
  animate: Sparkles,
}

const immersionColors = {
  imagen: "bg-blue-500",
  soundtrack: "bg-green-500",
  reflexion: "bg-purple-500",
  animate: "bg-orange-500",
}

export function ImmersionOverlay() {
  const { immersions, fetchImmersionContent } = useImmersionStore()
  const [showModal, setShowModal] = useState(false)

  const handleImmersionClick = async (immersion: any) => {
    if (immersion.type === "soundtrack") {
      // Para soundtrack, reproducir directamente sin modal
      // En producción: new Audio(content).play()
      console.log("Playing soundtrack:", immersion.content)
      return
    }

    await fetchImmersionContent(immersion)
    setShowModal(true)
  }

  return (
    <>
      <AnimatePresence>
        {immersions.map((immersion) => {
          const Icon = immersionIcons[immersion.type]
          const colorClass = immersionColors[immersion.type]

          return (
            <motion.button
              key={immersion.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleImmersionClick(immersion)}
              className={`absolute w-10 h-10 rounded-full ${colorClass} text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center`}
              style={{
                left: `${immersion.position.x}%`,
                top: `${immersion.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Icon className="h-5 w-5" />
            </motion.button>
          )
        })}
      </AnimatePresence>

      <ImmersionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
