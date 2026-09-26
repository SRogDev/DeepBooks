"use client"

import { useState, useEffect } from "react"
import { Menu, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableOfContents } from "./table-of-contents"
import { ReportModal } from "./report-modal"
import { useBooksStore, type Book } from "@/lib/stores/books-store"
import { motion, AnimatePresence } from "framer-motion"

interface BookReaderProps {
  bookId: string
}

// Mock chapters data
const mockChapters = [
  { id: "ch1", title: "El Despertar", page: 1 },
  { id: "ch2", title: "Primeros Pasos", page: 15 },
  { id: "ch3", title: "El Encuentro", page: 32 },
  { id: "ch4", title: "Revelaciones", page: 48 },
  { id: "ch5", title: "La Decisión", page: 67 },
  { id: "ch6", title: "El Viaje", page: 85 },
  { id: "ch7", title: "Confrontación", page: 103 },
  { id: "ch8", title: "El Final", page: 120 },
]

export function BookReader({ bookId }: BookReaderProps) {
  const [book, setBook] = useState<Book | null>(null)
  const [showTOC, setShowTOC] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { books } = useBooksStore()

  useEffect(() => {
    // Fase 1: el lector renderizará las secciones normalizadas del backend
    setBook(books.find((b) => b.id === bookId) || null)
  }, [bookId, books])

  if (!book) {
    return (
      <div className="flex h-screen items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          Este documento aún no está disponible.
          <br />
          La ingesta de documentos llega en la Fase 1.
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-screen bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-background/80 to-transparent">
        <Button variant="ghost" size="sm" onClick={() => setShowTOC(true)}>
          <Menu className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="sm" onClick={() => setShowReport(true)}>
          <Flag className="h-5 w-5" />
        </Button>
      </div>

      {/* Book Content */}
      <div className="h-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8 min-h-[600px]"
        >
          {/* Mock book content */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center mb-8">{book.title}</h1>
            <div className="space-y-4 text-justify leading-relaxed">
              <p>
                En el corazón de la ciudad antigua, donde las sombras danzan entre callejones empedrados y los secretos
                susurran desde cada rincón, comenzó una historia que cambiaría el destino de todos los que la
                escucharan.
              </p>
              <p>
                El protagonista, sin saberlo aún, estaba a punto de embarcarse en una aventura que pondría a prueba no
                solo su valentía, sino también su comprensión de la realidad misma. Los primeros rayos del amanecer se
                filtraban a través de las ventanas de su modesta habitación, anunciando el comienzo de un día que sería
                diferente a todos los anteriores.
              </p>
              <p>
                Mientras se preparaba para lo que creía sería una jornada ordinaria, fuerzas misteriosas ya habían
                puesto en marcha los engranajes del destino. El aire mismo parecía cargado de posibilidades infinitas, y
                cada paso que daba lo acercaba más a un encuentro que cambiaría su vida para siempre.
              </p>
              <p>
                En las páginas que siguen, descubriremos junto a él los misterios que se ocultan tras la fachada de lo
                cotidiano, y aprenderemos que a veces, las aventuras más extraordinarias comienzan con los gestos más
                simples.
              </p>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Table of Contents */}
      <AnimatePresence>
        {showTOC && (
          <TableOfContents
            chapters={mockChapters}
            currentPage={currentPage}
            onClose={() => setShowTOC(false)}
            onNavigate={(page) => {
              setCurrentPage(page)
              setShowTOC(false)
            }}
          />
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <ReportModal book={book} isOpen={showReport} onClose={() => setShowReport(false)} />
    </div>
  )
}
