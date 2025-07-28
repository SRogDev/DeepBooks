import { create } from "zustand"

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  category: string
  reads: number
  rating: number
  reviews: number
  description: string
  isPurchased?: boolean
  readingProgress?: number
}

export interface BookCategory {
  id: string
  name: string
  slug: string
}

interface BooksState {
  books: Book[]
  categories: BookCategory[]
  userLibrary: Book[]
  searchQuery: string
  selectedCategory: string | null
  setBooks: (books: Book[]) => void
  setCategories: (categories: BookCategory[]) => void
  setUserLibrary: (library: Book[]) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
  addToLibrary: (book: Book) => void
  updateReadingProgress: (bookId: string, progress: number) => void
}

export const useBooksStore = create<BooksState>((set) => ({
  books: [],
  categories: [
    { id: "1", name: "Ficción", slug: "ficcion" },
    { id: "2", name: "Terror", slug: "terror" },
    { id: "3", name: "Romance", slug: "romance" },
    { id: "4", name: "Ciencia Ficción", slug: "ciencia-ficcion" },
    { id: "5", name: "Fantasía", slug: "fantasia" },
    { id: "6", name: "Misterio", slug: "misterio" },
    { id: "7", name: "Biografía", slug: "biografia" },
    { id: "8", name: "Historia", slug: "historia" },
    { id: "9", name: "Autoayuda", slug: "autoayuda" },
    { id: "10", name: "Poesía", slug: "poesia" },
    { id: "11", name: "Drama", slug: "drama" },
    { id: "12", name: "Aventura", slug: "aventura" },
  ],
  userLibrary: [],
  searchQuery: "",
  selectedCategory: null,
  setBooks: (books) => set({ books }),
  setCategories: (categories) => set({ categories }),
  setUserLibrary: (library) => set({ userLibrary: library }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  addToLibrary: (book) =>
    set((state) => ({
      userLibrary: [...state.userLibrary, { ...book, readingProgress: 0 }],
    })),
  updateReadingProgress: (bookId, progress) =>
    set((state) => ({
      userLibrary: state.userLibrary.map((book) =>
        book.id === bookId ? { ...book, readingProgress: progress } : book,
      ),
    })),
}))
