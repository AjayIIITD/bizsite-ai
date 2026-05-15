"use client"

import { useEffect } from "react"

export function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site_id: slug, event: "PAGE_VIEW" }),
    }).catch(() => {})
  }, [slug])

  return null
}
