"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { BookCard } from "./book-card"
import type { Book } from "@/lib/stores/books-store"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"

interface BooksCarouselProps {
  title: string
  books: Book[]
}

export function BooksCarousel({ title, books }: BooksCarouselProps) {
  const [showMore, setShowMore] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Duplicar libros para efecto infinito
  const infiniteBooks = [...books, ...books]

  // Show more books when clicked on desktop
  const displayBooks = showMore ? [...books, ...books, ...books] : infiniteBooks

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h2 className="text-xl font-semibold lg:text-2xl">{title}</h2>
      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4">
          {displayBooks.map((book, index) => (
            <BookCard key={`${book.id}-${index}`} book={book} />
          ))}
          {!isMobile && !showMore && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMore(true)}
              className="flex-shrink-0 flex items-center justify-center w-32 h-48 lg:w-40 lg:h-56 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/60 transition-colors"
            >
              <ChevronRight className="h-8 w-8 text-primary" />
            </motion.button>
          )}
        </div>
      </ScrollArea>
    </motion.section>
  )
}
