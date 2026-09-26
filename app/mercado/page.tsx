import { MarketplaceContent } from "@/components/mercado/marketplace-content"

export default function MercadoPage() {
  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-1 text-2xl font-bold">Mercado</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Un estante comunitario donde la gente comparte sus libros. La
        biblioteca sigue siendo tu hogar; esto es solo para descubrir.
        <br />
        El intercambio es gratuito en el MVP — los pagos llegan después.
      </p>
      <MarketplaceContent />
    </div>
  )
}
