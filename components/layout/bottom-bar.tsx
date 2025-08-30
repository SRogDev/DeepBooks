"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Library, Users, PenTool, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/lib/stores/user-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function BottomBar() {
  const pathname = usePathname()
  const { user } = useUserStore()

  const baseNavItems = [
    { href: "/home", icon: Home, label: "Inicio" },
    { href: "/biblioteca", icon: Library, label: "Biblioteca" },
    { href: "/comunidad", icon: Users, label: "Comunidad" }
  ]

  const navItems = user?.isCreator
    ? [...baseNavItems, { href: "/gestion", icon: PenTool, label: "Escribir" }]
    : baseNavItems

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 rounded-lg px-3 py-2 transition-colors",
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={item.label}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
