"use client"

import Image from "next/image"
import type { Book } from "@/lib/stores/books-store"
import { motion } from "framer-motion"

interface BookCoverProps {
  book: Book
}

export function BookCover({ book }: BookCoverProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex justify-center"
    >
      <div className="relative">
        <div className="relative h-80 w-60 overflow-hidden rounded-2xl shadow-2xl">
          <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="object-cover" priority />
        </div>

        {/* Efecto de brillo */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      </div>
    </motion.div>
  )
}
