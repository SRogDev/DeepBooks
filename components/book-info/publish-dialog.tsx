"use client"

import { useEffect, useState } from "react"
import { Loader2, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getOrCreateDeviceId } from "@/lib/identity"

type Status = "checking" | "unlisted" | "listed" | "error"

interface ListingRef {
  id: string
  book_id: string
}

/**
 * Publicar / retirar un libro del mercado, desde el hub del libro.
 * El mercado del MVP es intercambio gratuito: no hay checkout.
 */
export function PublishDialog({ bookId }: { bookId: string }) {
  const [status, setStatus] = useState<Status>("checking")
  const [busy, setBusy] = useState(false)
  const [listingId, setListingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)

  const deviceHeaders = () => ({ "x-device-id": getOrCreateDeviceId() })

  const refresh = async () => {
    setStatus("checking")
    try {
      const res = await fetch("/api/marketplace")
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Error consultando el mercado")
      const found = (json.listings as ListingRef[]).find(
        (l) => l.book_id === bookId,
      )
      setListingId(found?.id ?? null)
      setStatus(found ? "listed" : "unlisted")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
      setStatus("error")
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

  const publish = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...deviceHeaders() },
        body: JSON.stringify({
          bookId,
          description: description.trim() || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "No se pudo publicar")
      setOpen(false)
      setDescription("")
      setBusy(false)
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
      setBusy(false)
    }
  }

  const unpublish = async () => {
    if (!listingId) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`/api/marketplace/${listingId}`, {
        method: "DELETE",
        headers: deviceHeaders(),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "No se pudo retirar")
      setBusy(false)
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
      setBusy(false)
    }
  }

  if (status === "checking") {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Consultando el mercado…
      </div>
    )
  }

  if (status === "error") {
    return <p className="text-center text-sm text-destructive">{error}</p>
  }

  if (status === "listed") {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={unpublish}
          disabled={busy}
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Store className="mr-2 h-4 w-4" />
          )}
          Retirar del mercado
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Este libro está visible en el mercado.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Store className="mr-2 h-4 w-4" />
            Publicar en el mercado
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publicar en el mercado</DialogTitle>
            <DialogDescription>
              Otros lectores podrán añadir una copia a su biblioteca. El
              intercambio es gratuito en el MVP: no hay pagos ni checkout.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="publish-description">
              Descripción (opcional)
            </Label>
            <Textarea
              id="publish-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Por qué compartes este libro…"
              rows={3}
              maxLength={500}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={publish} disabled={busy}>
              {busy && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Publicar gratis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
