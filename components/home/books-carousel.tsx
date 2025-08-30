"use client"

import React, { useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { BookCard } from "./book-card"
import type { Book } from "@/lib/stores/books-store"
import { motion } from "framer-motion"

interface BooksCarouselProps {
  title: string
  books: Book[]
}

export function BooksCarousel({ title, books }: BooksCarouselProps) {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
    skipSnaps: false,
  })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const displayBooks = [...books, ...books] // duplicar para loop

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h2 className="text-xl font-semibold lg:text-2xl">{title}</h2>

      <div ref={emblaRef} className="embla overflow-hidden w-full">
        <div className="embla__container flex select-none">
          {displayBooks.map((book, index) => (
            <div
              key={`${book.id}-${index}`}
              className="embla__slide flex-shrink-0"
              style={{
                flex: `0 0 ${isMobile ? "60vw" : "20vw"}`,
                minWidth: isMobile ? "60vw" : "20vw",
              }}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

