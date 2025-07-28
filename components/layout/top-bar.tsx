"use client"

import Link from "next/link"
import { User, FileText, Plus } from "lucide-react"
import { useUserStore } from "@/lib/stores/user-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useState } from "react"
import { SubscriptionModal } from "./subscription-modal"
import { Button } from "@/components/ui/button"

export function TopBar() {
  const { user, pagesAvailable } = useUserStore()
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b bg-background top-bar"
    >
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/profile" className="flex items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => setShowSubscriptionModal(true)}
            className="flex items-center space-x-1 rounded-full bg-primary/10 px-3 py-1 hover:bg-primary/20"
          >
            <span className="text-sm font-medium text-primary">{pagesAvailable}</span>
            <FileText className="h-4 w-4 text-primary" />
            <div className="relative">
              <Plus className="h-3 w-3 text-primary" />
            </div>
          </Button>
        </div>
      </div>
      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />
    </motion.header>
  )
}
