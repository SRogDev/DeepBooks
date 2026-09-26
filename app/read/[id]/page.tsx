import { BookReader } from "@/components/read/book-reader"

interface ReadPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { id } = await params
  return <BookReader bookId={id} />
}
