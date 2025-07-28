"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye, Star } from "lucide-react"
import type { Book } from "@/lib/stores/books-store"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface SearchResultItemProps {
  book: Book
}

export function SearchResultItem({ book }: SearchResultItemProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link href={`/book-info/${book.id}`}>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="relative h-16 w-12 flex-shrink-0">
                <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="rounded object-cover" />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-medium line-clamp-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{book.description}</p>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{book.reads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{book.rating}</span>
                  </div>
                  <div className="px-2 py-1 bg-primary/10 text-primary rounded-full">{book.category}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
