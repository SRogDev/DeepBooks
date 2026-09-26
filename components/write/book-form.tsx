"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/lib/stores/user-store"
import { useWriterStore } from "@/lib/stores/writer-store"
import { motion } from "framer-motion"

export function BookForm() {
  const { user } = useUserStore()
  const { addBook } = useWriterStore()
  const [isPublishing, setIsPublishing] = useState(false)
  const [formData, setFormData] = useState({
    cover: "",
    title: "",
    author: user?.name || "",
    synopsis: "",
    category: "",
    price: "",
  })

  const categories = [
    "Ficción",
    "Terror",
    "Romance",
    "Ciencia Ficción",
    "Fantasía",
    "Misterio",
    "Biografía",
    "Historia",
    "Autoayuda",
    "Poesía",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, cover: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)

    // Simular publicación
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const newBook = {
      id: `book-${Date.now()}`,
      title: formData.title,
      cover: formData.cover || "/placeholder.svg?height=120&width=80",
      pagesRead: 0,
      completionRate: 0,
      purchaseCount: 0,
      totalRevenue: 0,
      status: "pendiente" as const,
    }

    addBook(newBook)
    setIsPublishing(false)

    // Redirigir al panel de gestión
    window.location.href = "/gestion"
  }

  return (
    <div className="min-h-screen p-4">
      {/* Fixed Publish Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handlePublish}
          disabled={!formData.title || !formData.synopsis || isPublishing}
          className="bg-green-600 hover:bg-green-700"
        >
          {isPublishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publicando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Publish
            </>
          )}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Información del Libro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cover Upload */}
            <div className="space-y-2">
              <Label>Portada del libro</Label>
              <div className="flex items-center space-x-4">
                {formData.cover ? (
                  <img
                    src={formData.cover || "/placeholder.svg"}
                    alt="Book cover"
                    className="w-20 h-28 object-cover rounded border"
                  />
                ) : (
                  <div className="w-20 h-28 bg-muted rounded border flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    id="cover-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="cover-upload" className="cursor-pointer">
                      Subir Portada
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Nombre del libro</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ingresa el título de tu libro"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Nombre del autor</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Tu nombre como autor"
              />
            </div>

            {/* Synopsis */}
            <div className="space-y-2">
              <Label htmlFor="synopsis">Sinopsis</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => handleInputChange("synopsis", e.target.value)}
                placeholder="Describe tu libro de manera atractiva para los lectores..."
                rows={4}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Precio de venta (opcional)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Comprar libros en DeepBooks es opcional. Los usuarios siempre pueden leer gratis con sus páginas
                disponibles.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
