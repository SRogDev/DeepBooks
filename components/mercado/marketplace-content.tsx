"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Loader2,
  Plus,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { getOrCreateDeviceId } from "@/lib/identity"

interface ListingBook {
  title: string
  author: string | null
  cover_url: string | null
}

interface Listing {
  id: string
  book_id: string
  description: string | null
  price_cents: number
  created_at: string
  book: ListingBook
}

type AcquireState = "idle" | "busy" | "done" | "error"

function priceLabel(cents: number): string {
  if (cents <= 0) return "Gratis"
  return `Precio sugerido: $${(cents / 100).toFixed(2)}`
}

function ListingCard({ listing }: { listing: Listing }) {
  const [state, setState] = useState<AcquireState>("idle")
  const [error, setError] = useState<string | null>(null)

  const acquire = async () => {
    setState("busy")
    setError(null)
    try {
      const res = await fetch(`/api/marketplace/${listing.id}/acquire`, {
        method: "POST",
        headers: { "x-device-id": getOrCreateDeviceId() },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "No se pudo añadir el libro")
      setState("done")
    } catch (e) {
      setState("error")
      setError(e instanceof Error ? e.message : "Error desconocido")
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
          {listing.book.cover_url ? (
            <img
              src={listing.book.cover_url}
              alt={listing.book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <BookOpen className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{listing.book.title}</h3>
          <p className="truncate text-sm text-muted-foreground">
            {listing.book.author ?? "Autor desconocido"}
          </p>
          <p className="mt-1 text-sm font-medium text-primary">
            {priceLabel(listing.price_cents)}
          </p>
        </div>
      </CardHeader>
      {listing.description && (
        <CardContent className="pt-0">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {listing.description}
          </p>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex-col items-stretch gap-2">
        {state === "done" ? (
          <Button variant="outline" asChild>
            <Link href="/biblioteca">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              En tu biblioteca — ver
            </Link>
          </Button>
        ) : (
          <Button onClick={acquire} disabled={state === "busy"}>
            {state === "busy" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Añadir a mi biblioteca
          </Button>
        )}
        {state === "error" && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </CardFooter>
    </Card>
  )
}

export function MarketplaceContent() {
  const [listings, setListings] = useState<Listing[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch("/api/marketplace")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Error cargando el mercado")
        if (!cancelled) setListings(json.listings as Listing[])
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Error desconocido")
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/biblioteca">Volver a la biblioteca</Link>
        </Button>
      </div>
    )
  }

  if (listings === null) {
    return (
      <div className="flex h-64 items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Cargando el mercado…</p>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <Store className="h-10 w-10 text-muted-foreground" />
        <p className="font-medium">El mercado está vacío</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Nadie ha compartido libros todavía. Publica uno desde la página de
          cualquier libro de tu biblioteca.
        </p>
        <Button variant="outline" asChild>
          <Link href="/biblioteca">Ir a mi biblioteca</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  )
}
