import { create } from "zustand"

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userType: "lector" | "escritor"
  bookId: string
  bookTitle: string
  bookCover: string
  content: string
  image?: string
  type: "text" | "image"
  likes: number
  superlikes: number
  shares: number
  isLiked: boolean
  isSuperliked: boolean
  isShared: boolean
  createdAt: Date
}

interface CommunityState {
  posts: CommunityPost[]
  setPosts: (posts: CommunityPost[]) => void
  toggleLike: (postId: string) => void
  toggleSuperlike: (postId: string) => void
  toggleShare: (postId: string) => void
}

export const useCommunityStore = create<CommunityState>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    })),
  toggleSuperlike: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isSuperliked: !post.isSuperliked,
              superlikes: post.isSuperliked ? post.superlikes - 1 : post.superlikes + 1,
            }
          : post,
      ),
    })),
  toggleShare: (postId) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isShared: !post.isShared,
              shares: post.isShared ? post.shares - 1 : post.shares + 1,
            }
          : post,
      ),
    })),
}))
