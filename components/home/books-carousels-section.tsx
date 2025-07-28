"use client"

import { useEffect } from "react"
import { useBooksStore } from "@/lib/stores/books-store"
import { BooksCarousel } from "./books-carousel"
import { generateMockBooks } from "@/lib/mock-data"

// En una implementación real, estos carruseles vendrían del backend
// con diferentes criterios de filtrado y recomendación
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
  const { books, setBooks } = useBooksStore()

  useEffect(() => {
    // Simular carga de datos del backend
    const mockBooks = generateMockBooks()
    setBooks(mockBooks)
  }, [setBooks])

  return (
    <div className="space-y-8">
      {carouselSections.map((section) => (
        <BooksCarousel
          key={section.category}
          title={section.title}
          books={books.slice(0, 12)} // En real, filtrar por categoría
        />
      ))}
    </div>
  )
}
