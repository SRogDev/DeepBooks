import { BookReader } from "@/components/read/book-reader"

interface ReadPageProps {
  params: {
    id: string
  }
}

export default function ReadPage({ params }: ReadPageProps) {
  return <BookReader bookId={params.id} />
}
