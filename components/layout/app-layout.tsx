"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { TopBar } from "./top-bar"
import { BottomBar } from "./bottom-bar"
import { DesktopSidebar } from "./desktop-sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === "/"

  if (isLandingPage) {
    return <main className="min-h-screen">{children}</main>
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <DesktopSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 relative"> {/* Añadido relative aquí */}
        {/* Mobile Top Bar */}
        <div className="lg:hidden">
          <TopBar />
        </div>

        {/* Content */}
        <main className="flex-1">{children}</main> {/* Eliminado pb-16 */}

        {/* Mobile Bottom Bar - MOVIDO FUERA del contenedor flex */}
      </div>

      {/* BottomBar AHORA ESTÁ FUERA de la estructura flex */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomBar />
      </div>
    </div>
  )
}
