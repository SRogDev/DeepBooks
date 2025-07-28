import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface BookSales {
  id: string
  title: string
  cover: string
  pagesRead: number
  completionRate: number
  purchaseCount: number
  totalRevenue: number
  status: "en-venta" | "pendiente" | "rechazado"
}

export interface WriterStats {
  totalPagesRead: number
  totalRevenue: number
  activeBooks: number
}

interface WriterState {
  bookSales: BookSales[]
  writerStats: WriterStats
  setBookSales: (sales: BookSales[]) => void
  addBook: (book: BookSales) => void
  updateBookStatus: (bookId: string, status: BookSales["status"]) => void
}

export const useWriterStore = create<WriterState>()(
  persist(
    (set) => ({
      bookSales: [],
      writerStats: {
        totalPagesRead: 0,
        totalRevenue: 0,
        activeBooks: 0,
      },
      setBookSales: (sales) => set({ bookSales: sales }),
      addBook: (book) =>
        set((state) => ({
          bookSales: [...state.bookSales, book],
        })),
      updateBookStatus: (bookId, status) =>
        set((state) => ({
          bookSales: state.bookSales.map((book) => (book.id === bookId ? { ...book, status } : book)),
        })),
    }),
    {
      name: "writer-storage",
    },
  ),
)
