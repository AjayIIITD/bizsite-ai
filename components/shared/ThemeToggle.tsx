"use client"

import { useTheme } from "./ThemeProvider"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  )
}
