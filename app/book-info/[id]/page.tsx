import { BookInfoContent } from "@/components/book-info/book-info-content"

interface BookInfoPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BookInfoPage({ params }: BookInfoPageProps) {
  const { id } = await params
  return <BookInfoContent bookId={id} />
}
