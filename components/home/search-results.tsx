"use client"

import { useEffect, useCallback } from "react"
import { useSearchStore } from "@/lib/stores/search-store"
import { SearchResultItem } from "./search-result-item"
import { generateMockBooks } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const {
    searchResults,
    isSearching,
    hasMore,
    page,
    setSearchResults,
    appendSearchResults,
    setIsSearching,
    setHasMore,
    setPage,
  } = useSearchStore()

  const searchBooks = useCallback(
    async (searchQuery: string, pageNum = 1) => {
      if (!searchQuery.trim()) return

      setIsSearching(true)

      // Simular búsqueda con delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock search results - En producción sería una API call
      const allBooks = generateMockBooks()
      const filteredBooks = allBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      // Simular paginación
      const startIndex = (pageNum - 1) * 20
      const endIndex = startIndex + 20
      const paginatedResults = filteredBooks.slice(startIndex, endIndex)

      if (pageNum === 1) {
        setSearchResults(paginatedResults)
      } else {
        appendSearchResults(paginatedResults)
      }

      setHasMore(endIndex < filteredBooks.length)
      setIsSearching(false)
    },
    [setSearchResults, appendSearchResults, setIsSearching, setHasMore],
  )

  useEffect(() => {
    if (query) {
      setPage(1)
      searchBooks(query, 1)
    }
  }, [query, searchBooks, setPage])

  const loadMore = () => {
    if (!isSearching && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      searchBooks(query, nextPage)
    }
  }

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 &&
        !isSearching &&
        hasMore
      ) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isSearching, hasMore, page, query])

  if (!query) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Resultados de búsqueda</h2>
        {isSearching && page === 1 && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      <div className="space-y-3">
        {searchResults.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SearchResultItem book={book} />
          </motion.div>
        ))}
      </div>

      {isSearching && page > 1 && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && searchResults.length > 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">No hay más resultados</div>
      )}

      {searchResults.length === 0 && !isSearching && (
        <div className="text-center py-8 text-muted-foreground">No se encontraron resultados para "{query}"</div>
      )}
    </div>
  )
}
