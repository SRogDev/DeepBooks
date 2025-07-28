"use client"

import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/stores/user-store"
import { motion } from "framer-motion"

export function ProfileHeader() {
  const { user } = useUserStore()

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-4 text-center"
    >
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full">
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </motion.div>
  )
}
