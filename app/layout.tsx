import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AppLayout } from "@/components/layout/app-layout"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic", "normal"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "DeepBooks | New ways to experience books",
  description:
    "DeepBooks is an open-source generative reading engine: upload any book, direct the AI with plain-language creative guidelines, and get RAG-grounded moments, scenes, and ambient experiences from the actual text.",
  keywords: ["reading", "books", "generative AI", "RAG", "open source"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
