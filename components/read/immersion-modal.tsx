"use client"

import { useState } from "react"
import { X, Share, Loader2 } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useImmersionStore } from "@/lib/stores/immersion-store"
import { useCommunityStore } from "@/lib/stores/community-store"
import { useUserStore } from "@/lib/stores/user-store"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface ImmersionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImmersionModal({ isOpen, onClose }: ImmersionModalProps) {
  const { currentImmersion, isLoading } = useImmersionStore()
  const { posts, setPosts } = useCommunityStore()
  const { user } = useUserStore()
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    if (!currentImmersion || !user) return

    setIsSharing(true)

    // Simular compartir en la comunidad
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPost = {
      id: `post-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || "/placeholder.svg",
      userType: user.isCreator ? ("escritor" as const) : ("lector" as const),
      bookId: "current-book",
      bookTitle: "El Laberinto de los Sueños",
      bookCover: "/placeholder.svg?height=60&width=40",
      content: `Increíble inmersión: ${currentImmersion.title || "Contenido inmersivo"}`,
      image: currentImmersion.type === "imagen" ? currentImmersion.content : undefined,
      type: currentImmersion.type === "imagen" ? ("image" as const) : ("text" as const),
      likes: 0,
      superlikes: 0,
      shares: 0,
      isLiked: false,
      isSuperliked: false,
      isShared: false,
      createdAt: new Date(),
    }

    setPosts([newPost, ...posts])
    setIsSharing(false)
    onClose()
  }

  if (!currentImmersion) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{currentImmersion.title || "Contenido Inmersivo"}</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center space-x-2 bg-transparent"
            >
              {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share className="h-4 w-4" />}
              <span>{isSharing ? "Compartiendo..." : "Compartir"}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Generando contenido inmersivo...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {currentImmersion.type === "imagen" && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={currentImmersion.content || "/placeholder.svg"}
                    alt="Immersion content"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {currentImmersion.type === "animate" && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="w-20 h-20 bg-white/20 rounded-full"
                  />
                </div>
              )}

              {currentImmersion.type === "reflexion" && (
                <div className="bg-muted/50 rounded-lg p-6">
                  <p className="text-sm leading-relaxed">{currentImmersion.content}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
