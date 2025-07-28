"use client"

import Image from "next/image"
import { Heart, Zap, Share2, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { CommunityPost } from "@/lib/stores/community-store"
import { useCommunityStore } from "@/lib/stores/community-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: CommunityPost
}

export function PostCard({ post }: PostCardProps) {
  const { toggleLike, toggleSuperlike, toggleShare } = useCommunityStore()

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace unos minutos"
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    return `Hace ${Math.floor(diffInHours / 24)}d`
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header del Post */}
        <div className="flex items-center space-x-3 p-4 pb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.userAvatar || "/placeholder.svg"} alt={post.userName} />
            <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm">{post.userName}</h3>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  post.userType === "escritor"
                    ? "bg-primary/10 text-primary"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
                )}
              >
                {post.userType === "escritor" ? "✍️ Escritor" : "📖 Lector"}
              </Badge>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Referencia al Libro */}
        <div className="mx-4 mb-3 flex items-center space-x-2 rounded-lg bg-muted/50 p-2">
          <Image
            src={post.bookCover || "/placeholder.svg"}
            alt={post.bookTitle}
            width={24}
            height={36}
            className="rounded object-cover"
          />
          <span className="text-xs font-medium text-muted-foreground">De "{post.bookTitle}"</span>
        </div>

        {/* Contenido del Post */}
        <div className="px-4 pb-3">
          <p className="text-sm leading-relaxed">{post.content}</p>
        </div>

        {/* Imagen si existe */}
        {post.image && (
          <div className="relative aspect-video">
            <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between p-4 pt-3">
          <div className="flex items-center space-x-4">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(post.id)}
                className={cn("h-8 space-x-1 px-2", post.isLiked && "text-red-500")}
              >
                <Heart className={cn("h-4 w-4", post.isLiked && "fill-current")} />
                <span className="text-xs">{post.likes}</span>
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSuperlike(post.id)}
                className={cn("h-8 space-x-1 px-2", post.isSuperliked && "text-yellow-500")}
              >
                <Zap className={cn("h-4 w-4", post.isSuperliked && "fill-current")} />
                <span className="text-xs">{post.superlikes}</span>
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleShare(post.id)}
                className={cn("h-8 space-x-1 px-2", post.isShared && "text-primary")}
              >
                <Share2 className="h-4 w-4" />
                <span className="text-xs">{post.shares}</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
