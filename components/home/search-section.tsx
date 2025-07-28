"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CategoryFilter } from "./category-filter"
import { SearchResults } from "./search-results"
import { useBooksStore } from "@/lib/stores/books-store"
import { motion, AnimatePresence } from "framer-motion"

export function SearchSection() {
  const { searchQuery, setSearchQuery } = useBooksStore()
  const [isSearching, setIsSearching] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setIsSearching(value.length > 0)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título o autor..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CategoryFilter />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mostrar resultados de búsqueda en lugar de carruseles */}
      {isSearching ? <SearchResults query={searchQuery} /> : null}
    </div>
  )
}
