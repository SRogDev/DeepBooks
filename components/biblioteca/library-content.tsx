"use client"

import { useCallback, useEffect, useState } from "react"
import { Plus, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookBiblio, type LibraryBook } from "./book-biblio"
import { UploadDialog } from "./upload-dialog"
import { motion } from "framer-motion"

interface ApiBook {
  id: string
  title: string
  author: string | null
  cover_url: string | null
}

export function LibraryContent() {
  const [books, setBooks] = useState<LibraryBook[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch("/api/books")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Error cargando la biblioteca")
      setBooks(
        (json.books as ApiBook[]).map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author ?? "Autor desconocido",
          cover: b.cover_url ?? "/placeholder.svg",
        })),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
      setBooks([])
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (books === null) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Cargando tu biblioteca…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="max-w-md text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={load}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <>
        <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
          <p className="text-muted-foreground">Tu biblioteca está vacía.</p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar documento
          </Button>
          <p className="text-xs text-muted-foreground">
            PDF, EPUB, DOCX, TXT… cualquier formato.
          </p>
        </div>
        <UploadDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onUploaded={load}
        />
      </>
    )
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar documento
        </Button>
      </div>
      <div className="space-y-4">
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BookBiblio book={book} />
          </motion.div>
        ))}
      </div>
      <UploadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUploaded={load}
      />
    </>
  )
}
