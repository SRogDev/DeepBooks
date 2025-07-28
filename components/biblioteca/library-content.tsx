"use client"

import { useEffect } from "react"
import { useBooksStore } from "@/lib/stores/books-store"
import { BookBiblio } from "./book-biblio"
import { generateMockLibrary } from "@/lib/mock-library"
import { motion } from "framer-motion"

export function LibraryContent() {
  const { userLibrary, setUserLibrary } = useBooksStore()

  useEffect(() => {
    // Simular carga de biblioteca del usuario
    const mockLibrary = generateMockLibrary()
    setUserLibrary(mockLibrary)
  }, [setUserLibrary])

  if (userLibrary.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Tu biblioteca está vacía. ¡Comienza a leer!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {userLibrary.map((book, index) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <BookBiblio book={book} />
        </motion.div>
      ))}
    </div>
  )
}
