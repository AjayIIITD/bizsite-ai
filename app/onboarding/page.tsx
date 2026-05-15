"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import TemplateCard from "@/components/shared/TemplateCard"
import type { Template } from "@/components/shared/TemplateCard"
import OnboardingStep from "@/components/shared/OnboardingStep"
import { ButtonSpinner } from "@/components/shared/LoadingStates"
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  ExternalLink,
  Edit3,
  Share2,
} from "lucide-react"

const categories = [
  "restaurant",
  "salon",
  "shop",
  "service",
  "fitness",
  "other",
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")

  // Step 1: Business details
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")

  // Step 2: Template
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [templatesLoading, setTemplatesLoading] = useState(true)

  // Step 3: Content
  const [headline, setHeadline] = useState("")
  const [subheadline, setSubheadline] = useState("")
  const [about, setAbout] = useState("")
  const [services, setServices] = useState("")
  const [generating, setGenerating] = useState(false)

  // Step 4: Result
  const [slug, setSlug] = useState("")
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch("/api/templates")
        const data = await res.json()
        setTemplates(Array.isArray(data) ? data : data.templates || [])
        if (Array.isArray(data) && data.length > 0) {
          setSelectedTemplate(data[0])
        }
      } catch {
        // fallback
      } finally {
        setTemplatesLoading(false)
      }
    }
    loadTemplates()
  }, [])

  function validateStep1(): string | null {
    if (!name.trim()) return "Business name is required"
    if (!category) return "Please select a category"
    return null
  }

  function validateStep2(): string | null {
    if (!selectedTemplate) return "Please select a template"
    return null
  }

  function validateStep3(): string | null {
    if (!headline.trim()) return "Headline is required"
    return null
  }

  async function handleGenerateContent() {
    if (!category) return
    setGenerating(true)
    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: name,
          category,
          city,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.headline) setHeadline(data.headline)
        if (data.subheadline) setSubheadline(data.subheadline)
        if (data.about) setAbout(data.about)
        if (data.services) setServices(data.services)
      }
    } catch {
      // AI generation failed, user can write manually
    } finally {
      setGenerating(false)
    }
  }

  async function handlePublish() {
    setPublishing(true)
    setError("")
    try {
      // 1. Create business
      const bizRes = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          phone,
          city,
          address,
          headline,
          subheadline,
          about,
          services,
        }),
      })
      if (!bizRes.ok) {
        const err = await bizRes.json()
        throw new Error(err.error || "Failed to create business")
      }
      const business = await bizRes.json()

      // 2. Apply template
      if (selectedTemplate) {
        await fetch(`/api/templates/${selectedTemplate.id}/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId: business.id }),
        })
      }

      // 3. Publish
      const pubRes = await fetch(`/api/site/${business.id}/publish`, {
        method: "POST",
      })
      if (!pubRes.ok) {
        const err = await pubRes.json()
        throw new Error(err.error || "Failed to publish")
      }

      setSlug(business.slug)
      setStep(4)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setPublishing(false)
    }
  }

  function handleNext() {
    if (step === 1) {
      const err = validateStep1()
      if (err) { setError(err); return }
    }
    if (step === 2) {
      const err = validateStep2()
      if (err) { setError(err); return }
    }
    if (step === 3) {
      const err = validateStep3()
      if (err) { setError(err); return }
    }
    setError("")
    if (step < 4) {
      if (step === 3) {
        handlePublish()
      } else {
        setStep(step + 1)
      }
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                    s <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="size-4" /> : s}
                </div>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {["Business Details", "Choose Template", "Add Content", "Done!"][s - 1]}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 h-1 w-full rounded bg-muted">
              <div
                className="h-full rounded bg-primary transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step 1: Business Details */}
        <OnboardingStep step={1} currentStep={step}>
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Business Details</h2>
            <p className="text-sm text-muted-foreground">
              Apne business ki basic information daalein
            </p>

            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sharma Sweets"
              />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={(val) => setCategory(val ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123, Main Street"
              />
            </div>
          </Card>
        </OnboardingStep>

        {/* Step 2: Template Selection */}
        <OnboardingStep step={2} currentStep={step}>
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Choose a Template</h2>
            <p className="text-sm text-muted-foreground">
              Apne business ke liye ek design chunein
            </p>

            {templatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <ButtonSpinner />
              </div>
            ) : templates.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No templates available right now.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {templates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    selected={selectedTemplate?.id === t.id}
                    onSelect={(template) => setSelectedTemplate(template)}
                  />
                ))}
              </div>
            )}
          </Card>
        </OnboardingStep>

        {/* Step 3: Content */}
        <OnboardingStep step={3} currentStep={step}>
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Add Content</h2>
                <p className="text-sm text-muted-foreground">
                  Apne website ke liye content likhein
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateContent}
                disabled={generating || !category}
              >
                {generating ? (
                  <ButtonSpinner />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {generating ? "Generating..." : "Generate with AI"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Headline *</Label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Your main tagline"
              />
            </div>

            <div className="space-y-2">
              <Label>Subheadline</Label>
              <Input
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="A short description"
              />
            </div>

            <div className="space-y-2">
              <Label>About</Label>
              <Textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us about your business"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Services / Products</Label>
              <Textarea
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="What do you offer? (one per line)"
                rows={3}
              />
            </div>
          </Card>
        </OnboardingStep>

        {/* Step 4: Success */}
        <OnboardingStep step={4} currentStep={step}>
          <Card className="p-12 text-center space-y-6">
            {/* Confetti effect */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-400/30" />
                <div className="relative flex size-20 items-center justify-center rounded-full bg-green-100">
                  <Check className="size-10 text-green-600" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Website Published! </h2>
              <p className="mt-2 text-muted-foreground">
                Aapki website successfully publish ho gayi hai
              </p>
            </div>

            {slug && (
              <p className="text-sm font-mono text-primary">
                {slug}.bizsite.app
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                <ExternalLink className="size-4" />
                View My Site
              </a>
              <a
                href={`/editor/${slug}`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
              >
                <Edit3 className="size-4" />
                Edit Further
              </a>
              <Button
                variant="outline"
                onClick={() => {
                  const url = `${window.location.origin}/${slug}`
                  const text = `Check out my new website! ${url}`
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(text)}`,
                    "_blank"
                  )
                }}
              >
                <Share2 className="size-4" />
                Share on WhatsApp
              </Button>
            </div>
          </Card>
        </OnboardingStep>

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-destructive text-center">{error}</p>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setError("")
                if (step > 1) setStep(step - 1)
              }}
              disabled={step === 1}
            >
              <ChevronLeft className="size-4" /> Back
            </Button>
            <Button onClick={handleNext} disabled={publishing}>
              {publishing ? (
                <ButtonSpinner />
              ) : step === 3 ? (
                "Publish Website"
              ) : (
                <>
                  Next <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
