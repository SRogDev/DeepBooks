import { create } from "zustand"
import type { Book } from "./books-store"

interface SearchState {
  searchResults: Book[]
  isSearching: boolean
  hasMore: boolean
  page: number
  setSearchResults: (results: Book[]) => void
  appendSearchResults: (results: Book[]) => void
  setIsSearching: (searching: boolean) => void
  setHasMore: (hasMore: boolean) => void
  setPage: (page: number) => void
  resetSearch: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchResults: [],
  isSearching: false,
  hasMore: true,
  page: 1,
  setSearchResults: (results) => set({ searchResults: results }),
  appendSearchResults: (results) =>
    set((state) => ({
      searchResults: [...state.searchResults, ...results],
    })),
  setIsSearching: (searching) => set({ isSearching: searching }),
  setHasMore: (hasMore) => set({ hasMore }),
  setPage: (page) => set({ page }),
  resetSearch: () =>
    set({
      searchResults: [],
      isSearching: false,
      hasMore: true,
      page: 1,
    }),
}))
