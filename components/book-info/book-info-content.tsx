"use client"

import { useEffect, useState } from "react"
import { BookCover } from "./book-cover"
import { BookSynopsis } from "./book-synopsis"
import { BookStats } from "./book-stats"
import { BookActions } from "./book-actions"
import { PaymentModal } from "./payment-modal"
import type { Book } from "@/lib/stores/books-store"
import { useBooksStore } from "@/lib/stores/books-store"
import { generateMockBooks } from "@/lib/mock-data"
import { motion } from "framer-motion"

interface BookInfoContentProps {
  bookId: string
}

export function BookInfoContent({ bookId }: BookInfoContentProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { addToLibrary } = useBooksStore()

  useEffect(() => {
    // Simular carga del libro específico
    const mockBooks = generateMockBooks()
    const foundBook = mockBooks.find((b) => b.id === bookId) || mockBooks[0]
    setBook(foundBook)
  }, [bookId])

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
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
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
