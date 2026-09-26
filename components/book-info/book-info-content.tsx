"use client"

import { useEffect, useState } from "react"
import { BookCover } from "./book-cover"
import { BookSynopsis } from "./book-synopsis"
import { BookStats } from "./book-stats"
import { BookActions } from "./book-actions"
import { PaymentModal } from "./payment-modal"
import type { Book } from "@/lib/stores/books-store"
import { useBooksStore } from "@/lib/stores/books-store"
import { motion } from "framer-motion"

interface BookInfoContentProps {
  bookId: string
}

export function BookInfoContent({ bookId }: BookInfoContentProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { addToLibrary, books } = useBooksStore()

  useEffect(() => {
    // Fase 1: el libro llegará del backend con sus secciones normalizadas
    setBook(books.find((b) => b.id === bookId) || null)
  }, [bookId, books])

  const handleFreeRead = () => {
    if (book) {
      addToLibrary(book)
      // Redirigir a la página de lectura
      window.location.href = `/read/${book.id}`
    }
  }

  const handlePurchase = () => {
    setShowPaymentModal(true)
  }

  if (!book) {
    return (
      <div className="flex h-64 items-center justify-center text-center">
        <p className="text-muted-foreground">Este libro aún no está disponible.</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-4">
      <BookCover book={book} />
      <BookSynopsis book={book} />
      <BookStats book={book} />
      <BookActions onFreeRead={handleFreeRead} onPurchase={handlePurchase} />

      <PaymentModal book={book} isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </motion.div>
  )
}
