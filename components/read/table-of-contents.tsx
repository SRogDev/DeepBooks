"use client"

import { X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

interface SectionItem {
  id: string
  title: string
  index: number
}

interface TableOfContentsProps {
  sections: SectionItem[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function TableOfContents({ sections, currentIndex, onClose, onNavigate }: TableOfContentsProps) {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-0 left-0 bottom-0 z-50 w-80 bg-background border-r shadow-xl"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="font-semibold">Índice</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-full pb-16">
        <div className="p-4 space-y-2">
          {sections.map((section, i) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onNavigate(section.index)}
              className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-muted ${
                currentIndex === section.index
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium line-clamp-2">{section.title}</span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {section.index + 1}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  )
}
