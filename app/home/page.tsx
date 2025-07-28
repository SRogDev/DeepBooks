import { SearchSection } from "@/components/home/search-section"
import { BooksCarouselsSection } from "@/components/home/books-carousels-section"

export default function HomePage() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold mb-4">Descubre</h1>
      </div>
      <SearchSection />
      <BooksCarouselsSection />
    </div>
  )
}
