"use client"

import Link from "next/link"
import { Globe } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Globe className="size-6 text-primary" />
          BizSite
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Free Website Banayein
          </Link>
        </div>
      </div>
    </nav>
  )
}
