"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Library, Users, PenTool, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/lib/stores/user-store"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function DesktopSidebar() {
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
    <motion.aside
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r z-50 sidebar"
    >
      <div className="flex flex-col h-full">
        {/* Profile Section */}
        <div className="p-6 border-b">
          <Link
            href="/profile"
            className="flex items-center space-x-3 hover:bg-muted/50 rounded-lg p-2 transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name || "Usuario"}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="activeDesktopTab" className="ml-auto h-2 w-2 bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            <p>PrismaBook v1.0</p>
            <p>Explora tu imaginación</p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
