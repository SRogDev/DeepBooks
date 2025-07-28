"use client"

import { ImageIcon, Music, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ImmersionToolbarProps {
  selectedTool: string | null
  onToolSelect: (tool: string | null) => void
}

const tools = [
  { id: "imagen", icon: ImageIcon, label: "Imagen", color: "bg-blue-500" },
  { id: "soundtrack", icon: Music, label: "Soundtrack", color: "bg-green-500" },
  { id: "reflexion", icon: MessageCircle, label: "Reflexión", color: "bg-purple-500" },
  { id: "animate", icon: Sparkles, label: "Animación", color: "bg-orange-500" },
]

export function ImmersionToolbar({ selectedTool, onToolSelect }: ImmersionToolbarProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="flex items-center space-x-2 bg-background/95 backdrop-blur border rounded-full p-2 shadow-lg">
        {tools.map((tool) => {
          const Icon = tool.icon
          const isSelected = selectedTool === tool.id

          return (
            <Button
              key={tool.id}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolSelect(isSelected ? null : tool.id)}
              className={cn("rounded-full w-12 h-12 p-0", isSelected && tool.color)}
            >
              <Icon className="h-5 w-5" />
            </Button>
          )
        })}
      </div>
    </motion.div>
  )
}
