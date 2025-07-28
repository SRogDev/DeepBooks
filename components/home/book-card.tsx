"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye, Star } from "lucide-react"
import type { Book } from "@/lib/stores/books-store"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
      <Link href={`/book-info/${book.id}`}>
        <Card className="w-32 lg:w-40 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[3/4]">
              <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
            </div>
            <div className="p-2 lg:p-3 space-y-1">
              <h3 className="text-xs lg:text-sm font-medium line-clamp-2">{book.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{book.reads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{book.rating}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
