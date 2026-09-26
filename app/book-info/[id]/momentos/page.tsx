import { MomentosGallery } from "@/components/momentos/momentos-gallery"

interface MomentosPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MomentosPage({ params }: MomentosPageProps) {
  const { id } = await params
  return <MomentosGallery bookId={id} />
}
