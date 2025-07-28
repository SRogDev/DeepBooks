"use client"

import { X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

interface Chapter {
  id: string
  title: string
  page: number
}

interface TableOfContentsProps {
  chapters: Chapter[]
  currentPage: number
  onClose: () => void
  onNavigate: (page: number) => void
}

export function TableOfContents({ chapters, currentPage, onClose, onNavigate }: TableOfContentsProps) {
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
          {chapters.map((chapter, index) => (
            <motion.button
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onNavigate(chapter.page)}
              className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-muted ${
                currentPage >= chapter.page && (index === chapters.length - 1 || currentPage < chapters[index + 1].page)
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{chapter.title}</span>
                <span className="text-sm text-muted-foreground">p. {chapter.page}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  )
}
