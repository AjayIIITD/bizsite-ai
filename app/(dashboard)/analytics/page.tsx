"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { PageLoader } from "@/components/shared/LoadingStates"
import { Eye, Users, MessageSquare } from "lucide-react"

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  contactsReceived: number
  dailyViews: { date: string; count: number }[]
  recentEvents: {
    id: string
    type: string
    detail: string
    timestamp: string
  }[]
}

const periods = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "All Time", value: "all" },
] as const

type Period = (typeof periods)[number]["value"]

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>("7d")

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const bizRes = await fetch("/api/business/mine")
        if (!bizRes.ok) throw new Error("No business")
        const biz = await bizRes.json()

        const res = await fetch(`/api/analytics/${biz.id}?period=${period}`)
        if (res.ok) {
          const d = await res.json()
          setData(d)
        }
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [period])

  if (loading) return <PageLoader />

  if (!data) {
    return (
      <Card className="p-12 text-center text-muted-foreground">
        No analytics data available yet. Publish your site to start tracking.
      </Card>
    )
  }

  const statCards = [
    {
      label: "Total Views",
      value: data.totalViews,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Unique Visitors",
      value: data.uniqueVisitors,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Contacts Received",
      value: data.contactsReceived,
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ]

  const maxCount = Math.max(...data.dailyViews.map((d) => d.count), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your website performance</p>
        </div>
        <div className="flex gap-1 rounded-lg border p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="p-4 flex items-center gap-4">
              <div className={`flex size-12 items-center justify-center rounded-lg ${s.bg}`}>
                <Icon className={`size-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Simple SVG Line Chart */}
      {data.dailyViews.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Daily Views</h3>
          <div className="relative h-48">
            <svg
              viewBox={`0 0 ${data.dailyViews.length * 60} 200`}
              className="size-full"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                vectorEffect="non-scaling-stroke"
                points={data.dailyViews
                  .map((d, i) => `${i * 60 + 30},${200 - (d.count / maxCount) * 180}`)
                  .join(" ")}
              />
              {data.dailyViews.map((d, i) => (
                <circle
                  key={i}
                  cx={i * 60 + 30}
                  cy={200 - (d.count / maxCount) * 180}
                  r="3"
                  className="fill-primary"
                />
              ))}
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {data.dailyViews.filter((_, i) => i % Math.max(1, Math.floor(data.dailyViews.length / 7)) === 0).map((d) => (
              <span key={d.date}>
                {new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Events */}
      <div>
        <h3 className="font-semibold mb-4">Recent Events</h3>
        {data.recentEvents.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No recent events.
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Event</th>
                  <th className="text-left p-3 font-medium">Detail</th>
                  <th className="text-left p-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentEvents.map((e) => (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="p-3 font-medium capitalize">{e.type}</td>
                    <td className="p-3 text-muted-foreground">{e.detail}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(e.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
