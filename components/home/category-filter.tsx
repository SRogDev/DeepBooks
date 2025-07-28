"use client"

import { useBooksStore } from "@/lib/stores/books-store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

export function CategoryFilter() {
  const { categories, selectedCategory, setSelectedCategory } = useBooksStore()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Categorías</h3>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            Todas
          </Button>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.slug)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
