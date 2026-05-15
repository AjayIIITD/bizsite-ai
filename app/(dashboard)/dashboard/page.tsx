"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PageLoader } from "@/components/shared/LoadingStates"
import {
  Eye,
  MessageSquare,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
  Pencil,
} from "lucide-react"

interface Business {
  id: string
  name: string
  category: string
  slug: string
  status: "draft" | "published"
  totalViews: number
  templateId: string | null
}

interface Contact {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export default function DashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/business/mine")
        if (res.ok) {
          const data = await res.json()
          setBusiness(data)
          if (data.id) {
            const cRes = await fetch(`/api/contact/${data.id}`)
            if (cRes.ok) {
              const cData = await cRes.json()
              setContacts(Array.isArray(cData) ? cData : cData.contacts || [])
            }
          }
        }
      } catch {
        // not logged in or error
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <PageLoader />

  const stats = [
    {
      label: "Total Views",
      value: business?.totalViews ?? 0,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Contacts",
      value: contacts.length,
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Status",
      value: business?.status === "published" ? "Published" : "Draft",
      icon: business?.status === "published" ? CheckCircle2 : Clock,
      color: business?.status === "published" ? "text-green-600" : "text-amber-600",
      bg: business?.status === "published" ? "bg-green-100" : "bg-amber-100",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          {business ? `Welcome, ${business.name}` : "Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {business
            ? `Your ${business.category} website is ${business.status}`
            : "Create your first website to get started"}
        </p>
      </div>

      {!business ? (
        <Card className="p-12 text-center">
          <h2 className="text-xl font-semibold">No website yet</h2>
          <p className="mt-2 text-muted-foreground">
            Create your professional website in 2 minutes
          </p>
          <a
            href="/onboarding"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Get Started
          </a>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((s) => {
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

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href={`/editor/${business.id}`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                <Pencil className="size-4" /> Edit Website
              </a>
              <a
                href={`/${business.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="size-4" /> View Live Site
              </a>
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/${business.slug}`
                  )
                }
              >
                <Share2 className="size-4" /> Share
              </Button>
            </div>
          </div>

          {/* Recent Contacts */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Contacts</h2>
            {contacts.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                No contacts yet. Share your site to start receiving inquiries.
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Email</th>
                      <th className="text-left p-3 font-medium">Message</th>
                      <th className="text-left p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.slice(0, 10).map((c) => (
                      <tr key={c.id} className="border-b last:border-0">
                        <td className="p-3">{c.name}</td>
                        <td className="p-3 text-muted-foreground">{c.email}</td>
                        <td className="p-3 text-muted-foreground max-w-[200px] truncate">
                          {c.message}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
