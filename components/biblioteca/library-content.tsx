"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useBooksStore } from "@/lib/stores/books-store"
import { BookBiblio } from "./book-biblio"
import { motion } from "framer-motion"

export function LibraryContent() {
  const { userLibrary } = useBooksStore()

  if (userLibrary.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground">Tu biblioteca está vacía.</p>
        <Button asChild>
          <Link href="/escribir">
            <Plus className="mr-2 h-4 w-4" />
            Agregar documento
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">PDF, EPUB, DOCX, TXT… cualquier formato.</p>
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
