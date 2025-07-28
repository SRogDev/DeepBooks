"use client"

import Link from "next/link"
import Image from "next/image"
import type { Book } from "@/lib/stores/books-store"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface BookBiblioProps {
  book: Book
}

export function BookBiblio({ book }: BookBiblioProps) {
  const progress = book.readingProgress || 0

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link href={`/read/${book.id}`}>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="relative h-20 w-16 flex-shrink-0">
                <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="rounded object-cover" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium line-clamp-1">{book.title}</h3>
                  {book.isPurchased && (
                    <Badge variant="secondary" className="ml-2">
                      Comprado
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">{book.author}</p>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progreso</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
