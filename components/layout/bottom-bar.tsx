"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Library, Users, PenTool } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/lib/stores/user-store"

export function BottomBar() {
  const pathname = usePathname()
  const { user } = useUserStore()

  const baseNavItems = [
    { href: "/home", icon: Home, label: "Inicio" },
    { href: "/biblioteca", icon: Library, label: "Biblioteca" },
    { href: "/comunidad", icon: Users, label: "Comunidad" },
  ]

  const navItems = user?.isCreator
    ? [...baseNavItems, { href: "/gestion", icon: PenTool, label: "Escribir" }]
    : baseNavItems

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-[1000] border-t bg-background"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100vw',
        contain: 'strict',
        willChange: 'transform',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'hsl(var(--background)/0.8)'
      }}
    >
      <div className="flex h-16 items-center justify-around px-4 mx-auto max-w-md">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 rounded-lg px-3 py-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && <motion.div layoutId="activeTab" className="absolute -bottom-1 h-0.5 w-8 bg-primary" />}
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
