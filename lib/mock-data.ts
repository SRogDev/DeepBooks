import type { Book } from "./stores/books-store"

export function generateMockBooks(): Book[] {
  const titles = [
    "El Laberinto de los Sueños",
    "Crónicas del Tiempo Perdido",
    "La Última Profecía",
    "Sombras en la Niebla",
    "El Jardín de los Secretos",
    "Voces del Abismo",
    "La Torre de Cristal",
    "Memorias de un Viajero",
    "El Código Ancestral",
    "Lunas de Medianoche",
    "El Espejo Roto",
    "Cartas desde el Futuro",
  ]

  const authors = [
    "Elena Martínez",
    "Carlos Ruiz",
    "Ana García",
    "Miguel Santos",
    "Laura Fernández",
    "David López",
    "Carmen Rodríguez",
    "Javier Moreno",
  ]

  const categories = ["ficcion", "terror", "romance", "ciencia-ficcion", "fantasia", "misterio"]

  return titles.map((title, index) => ({
    id: `book-${index + 1}`,
    title,
    author: authors[index % authors.length],
    cover: `/placeholder.svg?height=400&width=300&query=book cover ${title}`,
    category: categories[index % categories.length],
    reads: Math.floor(Math.random() * 10000) + 100,
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    reviews: Math.floor(Math.random() * 500) + 10,
    description: `Una fascinante historia que te transportará a mundos increíbles. ${title} es una obra maestra de la literatura contemporánea.`,
  }))
}
