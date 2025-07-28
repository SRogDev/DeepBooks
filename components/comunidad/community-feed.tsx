"use client"

import { useEffect } from "react"
import { useCommunityStore } from "@/lib/stores/community-store"
import { PostCard } from "./post-card"
import { generateMockPosts } from "@/lib/mock-community"
import { motion } from "framer-motion"

export function CommunityFeed() {
  const { posts, setPosts } = useCommunityStore()

  useEffect(() => {
    const mockPosts = generateMockPosts()
    setPosts(mockPosts)
  }, [setPosts])

  return (
    <div className="space-y-4 p-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}
    </div>
  )
}
