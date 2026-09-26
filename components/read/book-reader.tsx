"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Menu, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableOfContents } from "./table-of-contents"
import { GeneratePanel } from "./generate-panel"
import { AmbientMomentCard } from "./ambient-moment-card"
import { useAmbientTrigger } from "@/lib/ambient/use-ambient-trigger"
import { FEATURE_AMBIENT } from "@/lib/flags"
import type { AmbientIntensity } from "@/lib/ambient/trigger"
import { motion, AnimatePresence } from "framer-motion"

interface Section {
  id: string
  idx: number
  title: string | null
  text: string
}

interface BookDetail {
  id: string
  title: string
  author: string | null
  last_section_idx: number
  ambient_intensity: AmbientIntensity
}

interface BookReaderProps {
  bookId: string
}

export function BookReader({ bookId }: BookReaderProps) {
  const [book, setBook] = useState<BookDetail | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTOC, setShowTOC] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Error cargando el documento")
        if (cancelled) return
        const bookData = json.book as BookDetail
        const sectionData = json.sections as Section[]
        setBook(bookData)
        setSections(sectionData)
        setCurrentIdx(
          Math.min(
            bookData.last_section_idx ?? 0,
            Math.max(sectionData.length - 1, 0),
          ),
        )
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

  const goTo = useCallback(
    (idx: number) => {
      setCurrentIdx(idx)
      setShowTOC(false)
      contentRef.current?.scrollTo({ top: 0 })
      // Persiste la posición (sección) sin bloquear la UI
      fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ last_section_idx: idx }),
      }).catch(() => {})
    },
    [bookId],
  )

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Abriendo el documento…</p>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">
          {error ?? "Este documento no está disponible."}
        </p>
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          Este documento aún no tiene secciones legibles.
        </p>
      </div>
    )
  }

  const section = sections[currentIdx]
  const paragraphs = section.text.split(/\n+/).filter((p) => p.trim())

  // Momentos ambientales: solo en límites seguros o pausas (Fase 3).
  const { moment: ambientMoment, dismiss: dismissAmbient } =
    useAmbientTrigger({
      bookId,
      sectionId: section.id,
      sectionIdx: currentIdx,
      intensity: book.ambient_intensity ?? "off",
      scrollContainerRef: contentRef,
    })

  return (
    <div className="relative h-screen bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-gradient-to-b from-background/80 to-transparent">
        <Button variant="ghost" size="sm" onClick={() => setShowTOC(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <p className="max-w-48 truncate text-sm font-medium">{book.title}</p>
          <p className="text-xs text-muted-foreground">
            Sección {currentIdx + 1} de {sections.length}
          </p>
        </div>
        <div className="w-9" />
      </div>

      {/* Book Content */}
      <div ref={contentRef} className="h-full overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-8 pt-20 pb-28">
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-8"
          >
            {section.title && (
              <h2 className="text-xl font-bold mb-6">{section.title}</h2>
            )}
            <div className="space-y-4 text-justify leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-gradient-to-t from-background/90 to-transparent">
        <Button
          variant="outline"
          size="sm"
          disabled={currentIdx === 0}
          onClick={() => goTo(currentIdx - 1)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentIdx === sections.length - 1}
          onClick={() => goTo(currentIdx + 1)}
        >
          Siguiente
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Table of Contents */}
      <AnimatePresence>
        {showTOC && (
          <TableOfContents
            sections={sections.map((s) => ({
              id: s.id,
              title: s.title ?? `Sección ${s.idx + 1}`,
              index: s.idx,
            }))}
            currentIndex={currentIdx}
            onClose={() => setShowTOC(false)}
            onNavigate={goTo}
          />
        )}
      </AnimatePresence>

      {/* On-demand generation */}
      <GeneratePanel
        key={section.id}
        bookId={bookId}
        sectionId={section.id}
        sectionIdx={currentIdx}
        sectionTitle={section.title}
        totalSections={sections.length}
      />

      {/* Ambient moment (non-blocking surprise) */}
      {FEATURE_AMBIENT && (
        <AnimatePresence>
          {ambientMoment && (
            <AmbientMomentCard
              key={ambientMoment.id}
              bookId={bookId}
              text={ambientMoment.text}
              label={ambientMoment.label}
              onDismiss={dismissAmbient}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
