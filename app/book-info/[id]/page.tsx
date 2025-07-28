import { BookInfoContent } from "@/components/book-info/book-info-content"

interface BookInfoPageProps {
  params: {
    id: string
  }
}

export default function BookInfoPage({ params }: BookInfoPageProps) {
  return <BookInfoContent bookId={params.id} />
}
