"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, AlertCircle, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getOrCreateDeviceId } from "@/lib/identity"

type Status = "idle" | "uploading" | "done" | "error"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Se llama cuando la ingesta termina OK para refrescar la lista. */
  onUploaded: () => void
}

const ACCEPT = ".pdf,.epub,.docx,.txt,.md"

export function UploadDialog({ open, onOpenChange, onUploaded }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [bookId, setBookId] = useState<string | null>(null)
  const router = useRouter()

  const reset = () => {
    setFile(null)
    setTitle("")
    setAuthor("")
    setStatus("idle")
    setError(null)
    setBookId(null)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const submit = async () => {
    if (!file || status === "uploading") return
    setStatus("uploading")
    setError(null)
    try {
      const form = new FormData()
      form.append("file", file)
      if (title.trim()) form.append("title", title.trim())
      if (author.trim()) form.append("author", author.trim())
      form.append("ownerId", getOrCreateDeviceId())
      const res = await fetch("/api/ingest", { method: "POST", body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Error en la ingesta")
      setBookId(json.bookId as string)
      setStatus("done")
      onUploaded()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
      setStatus("error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar documento</DialogTitle>
          <DialogDescription>
            Sube un libro en cualquier formato. Lo procesamos en secciones
            legibles y lo dejamos listo en tu biblioteca.
          </DialogDescription>
        </DialogHeader>

        {status === "done" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="font-medium">Documento listo en tu biblioteca.</p>
            <p className="text-sm text-muted-foreground">
              Ya puedes leerlo con sus secciones normalizadas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="upload-file">Archivo</Label>
              <Input
                id="upload-file"
                type="file"
                accept={ACCEPT}
                disabled={status === "uploading"}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                PDF, EPUB, DOCX, TXT o MD · máximo 25 MB.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upload-title">Título (opcional)</Label>
              <Input
                id="upload-title"
                placeholder="Se detecta del documento si lo dejas vacío"
                value={title}
                disabled={status === "uploading"}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upload-author">Autor (opcional)</Label>
              <Input
                id="upload-author"
                value={author}
                disabled={status === "uploading"}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            {status === "uploading" && (
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo y procesando… puede tardar un minuto.
              </div>
            )}

            {status === "error" && error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {status === "done" ? (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cerrar
              </Button>
              <Button
                onClick={() => bookId && router.push(`/read/${bookId}`)}
                disabled={!bookId}
              >
                Leer ahora
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={submit} disabled={!file || status === "uploading"}>
                {status === "uploading" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileUp className="mr-2 h-4 w-4" />
                )}
                {status === "error" ? "Reintentar" : "Subir documento"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
