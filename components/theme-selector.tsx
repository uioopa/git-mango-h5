"use client"

import { Check } from "lucide-react"
import { useCV } from "@/lib/cv-context"
import { cn } from "@/lib/utils"

export function ThemeSelector() {
  const { cvData, updateTheme } = useCV()
  const selectedTheme = cvData.theme

  const themes = [
    {
      id: "modern",
      name: "Modern",
      thumbnail: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "minimal",
      name: "Minimal",
      thumbnail: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "classic",
      name: "Classic",
      thumbnail: "/placeholder.svg?height=80&width=120",
    },
    {
      id: "github",
      name: "GitHub",
      thumbnail: "/placeholder.svg?height=80&width=120",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {themes.map((theme) => (
        <div
          key={theme.id}
          className={cn(
            "relative cursor-pointer rounded-md border p-2 transition-all hover:border-primary",
            selectedTheme === theme.id ? "border-primary bg-primary/5" : "border-border",
          )}
          onClick={() => updateTheme(theme.id)}
        >
          {selectedTheme === theme.id && (
            <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
          <div className="mb-2 overflow-hidden rounded border">
            <img src={theme.thumbnail || "/placeholder.svg"} alt={theme.name} className="h-auto w-full object-cover" />
          </div>
          <div className="text-center text-xs font-medium">{theme.name}</div>
        </div>
      ))}
    </div>
  )
}
