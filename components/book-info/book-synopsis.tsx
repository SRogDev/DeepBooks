"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Book } from "@/lib/stores/books-store"
import { motion, AnimatePresence } from "framer-motion"

interface BookSynopsisProps {
  book: Book
}

export function BookSynopsis({ book }: BookSynopsisProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const fullDescription = `${book.description} 

En esta cautivadora historia, el autor nos transporta a un mundo donde la realidad y la fantasía se entrelazan de manera magistral. Los personajes cobran vida con una profundidad emocional que resonará en el corazón de cada lector.

A través de una narrativa envolvente y un estilo único, esta obra explora temas universales como el amor, la pérdida, la esperanza y la redención. Cada página está cargada de simbolismo y metáforas que invitan a la reflexión.

Una lectura imprescindible que dejará una huella imborrable en tu memoria y te hará cuestionar tu percepción del mundo que te rodea.`

  const shortDescription = book.description

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Sinopsis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h2 className="text-xl font-bold">{book.title}</h2>
            <p className="text-muted-foreground">por {book.author}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isExpanded ? "expanded" : "collapsed"}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {isExpanded ? fullDescription : shortDescription}
              </p>
            </motion.div>
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 p-0 text-primary hover:text-primary/80"
          >
            {isExpanded ? (
              <>
                Ver menos <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Ver más <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
