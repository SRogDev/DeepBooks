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
    <div className="min-h-screen flex lg:flex-row flex-col">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <DesktopSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 relative w-full min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden fixed z-50 w-full">
          <TopBar />
        </header>
        {/* Content, padding-bottom solo en móvil */}
        <main className="flex-1 w-full pb-16 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomBar />
      </div>
    </div>
  )
}

