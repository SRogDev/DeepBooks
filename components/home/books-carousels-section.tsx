"use client"

import { useBooksStore } from "@/lib/stores/books-store"
import { BooksCarousel } from "./books-carousel"

// Fase 4: estos carruseles se alimentarán del mercado con criterios
// de filtrado y recomendación del backend.
const carouselSections = [
  { title: "Nuevos Lanzamientos", category: "nuevos" },
  { title: "Recomendados para Ti", category: "recomendados" },
  { title: "Terroríficos", category: "terror" },
  { title: "Romance", category: "romance" },
  { title: "Ciencia Ficción", category: "ciencia-ficcion" },
  { title: "Fantasía", category: "fantasia" },
  { title: "Más Leídos", category: "populares" },
  { title: "Clásicos", category: "clasicos" },
]

export function BooksCarouselsSection() {
  const { books } = useBooksStore()

  if (books.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-center">
        <p className="text-muted-foreground">
          El mercado abre pronto. Por ahora, tu biblioteca es el centro.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {carouselSections.map((section) => (
        <BooksCarousel key={section.category} title={section.title} books={books.slice(0, 12)} />
      ))}
    </div>
  )
}
