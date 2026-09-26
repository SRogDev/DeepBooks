"use client"

import { useUserStore } from "@/lib/stores/user-store"
import { ReadingStats } from "./reading-stats"
import { WritingStats } from "./writing-stats"
import { ProfileSettings } from "./profile-settings"
import { CreatorModeToggle } from "./creator-mode-toggle"
import { motion } from "framer-motion"

export function ProfileContent() {
  const { user } = useUserStore()

  if (!user) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-6">
      {user.isCreator && <WritingStats />}
      <ReadingStats />
      <ProfileSettings />
      <CreatorModeToggle />
    </motion.div>
  )
}
