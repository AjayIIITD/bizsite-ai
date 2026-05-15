"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import TemplateCard from "@/components/shared/TemplateCard"
import type { Template } from "@/components/shared/TemplateCard"
import { PageLoader } from "@/components/shared/LoadingStates"
import { ButtonSpinner } from "@/components/shared/LoadingStates"
import { Check } from "lucide-react"

const categories = ["All", "Restaurant", "Salon", "Shop", "Service", "Fitness"]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("All")
  const [preview, setPreview] = useState<Template | null>(null)
  const [applying, setApplying] = useState(false)
  const [appliedId, setAppliedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/templates")
        const data = await res.json()
        setTemplates(Array.isArray(data) ? data : data.templates || [])
      } catch {
        // fallback to empty
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered =
    category === "All"
      ? templates
      : templates.filter((t) => t.category.toLowerCase() === category.toLowerCase())

  async function handleApply(templateId: string) {
    setApplying(true)
    try {
      const res = await fetch("/api/business/mine")
      if (!res.ok) throw new Error("Not found")
      const business = await res.json()

      const applyRes = await fetch(`/api/templates/${templateId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id }),
      })
      if (!applyRes.ok) throw new Error("Failed to apply template")
      setAppliedId(templateId)
      setPreview(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to apply template")
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Template Gallery</h1>
        <p className="text-muted-foreground">
          Choose a template that fits your business
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No templates found for this category.
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              selected={appliedId === t.id}
              onSelect={(template) => setPreview(template)}
            />
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      {preview && (
        <Dialog open={!!preview} onOpenChange={(open) => { if (!open) setPreview(null) }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{preview.name}</DialogTitle>
              <DialogDescription className="capitalize">
                {preview.category}
              </DialogDescription>
            </DialogHeader>
            <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
              <img
                src={preview.thumbnail}
                alt={preview.name}
                className="size-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/800x450/e2e8f0/64748b?text=${encodeURIComponent(preview.name)}`
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{preview.description}</p>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                disabled={applying || appliedId === preview.id}
                onClick={() => handleApply(preview.id)}
              >
                {applying ? (
                  <ButtonSpinner />
                ) : appliedId === preview.id ? (
                  <Check className="size-4" />
                ) : null}
                {appliedId === preview.id ? "Applied" : "Apply Template"}
              </Button>
              <Button variant="outline" onClick={() => setPreview(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
