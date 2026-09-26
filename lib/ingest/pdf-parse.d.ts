/**
 * pdf-parse: el entry point oficial (index.js) ejecuta código de debug al
 * importarse (lee ./test/data/05-versions-space.pdf si module.parent es
 * undefined, como ocurre en ESM/vitest). Importamos lib/pdf-parse.js directo,
 * que es el módulo real sin ese side-effect.
 */
declare module "pdf-parse/lib/pdf-parse.js" {
  interface PdfInfo {
    Title?: string
    Author?: string
    [key: string]: unknown
  }
  interface PdfParseResult {
    numpages: number
    numrender: number
    info: PdfInfo | undefined
    metadata: unknown
    text: string
    version: string
  }
  function pdfParse(
    dataBuffer: Buffer | Uint8Array,
    options?: Record<string, unknown>,
  ): Promise<PdfParseResult>
  export default pdfParse
}
