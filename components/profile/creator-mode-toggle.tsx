"use client"

import { useState } from "react"
import { Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUserStore } from "@/lib/stores/user-store"

export function CreatorModeToggle() {
  const { user, toggleCreatorMode } = useUserStore()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleToggle = () => {
    toggleCreatorMode()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent">
          <Pen className="mr-2 h-4 w-4" />
          {user.isCreator ? "Cambiar a modo Lector" : "Cambiar a modo Creador"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.isCreator ? "Modo Lector" : "Modo Creador"}</DialogTitle>
          <DialogDescription>
            {user.isCreator
              ? "Al cambiar al modo lector, tendrás acceso principalmente a funciones de lectura y descubrimiento de contenido."
              : "Al activar el modo creador, podrás publicar historias, ver estadísticas de escritura y acceder a herramientas de autor."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleToggle}>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
