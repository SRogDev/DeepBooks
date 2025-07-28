"use client"

import { Moon, Bell, Bookmark } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useUserStore } from "@/lib/stores/user-store"
import { useTheme } from "next-themes"

export function ProfileSettings() {
  const { user, updateSettings } = useUserStore()
  const { theme, setTheme } = useTheme()

  if (!user) return null

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
    updateSettings({ darkMode: checked })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Moon className="h-5 w-5" />
            <span>Modo Oscuro</span>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={handleThemeToggle} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5" />
            <span>Notificaciones</span>
          </div>
          <Switch
            checked={user.settings.notifications}
            onCheckedChange={(checked) => updateSettings({ notifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bookmark className="h-5 w-5" />
            <span>Auto-marcador</span>
          </div>
          <Switch
            checked={user.settings.autoBookmark}
            onCheckedChange={(checked) => updateSettings({ autoBookmark: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
