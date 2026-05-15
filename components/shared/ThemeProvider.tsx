"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: "light", toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const initial = stored || preferred
    setTheme(initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"))

  if (!mounted) return <>{children}</>

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
