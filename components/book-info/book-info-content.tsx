"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, AlertCircle, FileText } from "lucide-react"
import { BookCover } from "./book-cover"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface BookInfoContentProps {
  bookId: string
}

interface BookDetail {
  id: string
  title: string
  author: string | null
  cover_url: string | null
  created_at: string
}

export function BookInfoContent({ bookId }: BookInfoContentProps) {
  const [book, setBook] = useState<BookDetail | null>(null)
  const [sectionCount, setSectionCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Error cargando el libro")
        if (cancelled) return
        setBook(json.book as BookDetail)
        setSectionCount((json.sections as unknown[]).length)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error desconocido")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [bookId])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando…</p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">
          {error ?? "Este libro no existe o fue eliminado."}
        </p>
        <Button variant="outline" asChild>
          <Link href="/biblioteca">Volver a la biblioteca</Link>
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-md space-y-6 p-4"
    >
      <BookCover
        book={{ cover: book.cover_url ?? "/placeholder.svg", title: book.title }}
      />
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <p className="text-muted-foreground">
          {book.author ?? "Autor desconocido"}
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        {sectionCount} {sectionCount === 1 ? "sección" : "secciones"}
      </div>
      <Button className="w-full" size="lg" asChild>
        <Link href={`/read/${book.id}`}>
          <BookOpen className="mr-2 h-5 w-5" />
          Leer ahora
        </Link>
      </Button>
    </motion.div>
  )
}
