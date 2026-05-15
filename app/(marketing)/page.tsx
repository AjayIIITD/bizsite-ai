"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TemplateCard from "@/components/shared/TemplateCard"
import type { Template } from "@/components/shared/TemplateCard"
import {
  Globe,
  Smartphone,
  MessageCircle,
  Sparkles,
  Check,
  ArrowRight,
  Zap,
} from "lucide-react"

const steps = [
  {
    icon: <Globe className="size-8" />,
    title: "Register",
    desc: "Apna account banayein",
  },
  {
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    title: "Pick Template",
    desc: "Apni pasand ka design chunein",
  },
  {
    icon: <Zap className="size-8" />,
    title: "Publish",
    desc: "2 minute mein website live!",
  },
]

const sampleTemplates: Template[] = [
  { id: "1", name: "Dawat Restaurant", category: "restaurant", thumbnail: "/templates/restaurant.jpg", description: "Perfect for restaurants, dhabas, and cafes" },
  { id: "2", name: "Style Salon", category: "salon", thumbnail: "/templates/salon.jpg", description: "For salons, parlours, and barbershops" },
  { id: "3", name: "Kirana Shop", category: "shop", thumbnail: "/templates/shop.jpg", description: "For retail stores and local shops" },
  { id: "4", name: "Seva Services", category: "service", thumbnail: "/templates/service.jpg", description: "For plumbers, electricians, and service providers" },
]

const features = [
  { icon: Sparkles, title: "AI Content", desc: "AI se apna content likhwayein" },
  { icon: MessageCircle, title: "WhatsApp Integration", desc: "Customer directly WhatsApp karein" },
  { icon: Globe, title: "Free Subdomain", desc: "aapka-naam.bizsite.app" },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Har phone par perfect dikhe" },
]

export default function LandingPage() {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="mx-auto max-w-7xl px-4 text-center relative">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Apna Business, Apni Website —{" "}
            <span className="text-primary">2 Minute Mein!</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Bina coding ke, bina kisi jhanjhat ke. Apne business ke liye ek professional website
            banayein aur naye customers paayein.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Free Website Banayein <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-base font-medium transition-colors hover:bg-muted hover:text-foreground"
            >
              Kaise Kaam Karta Hai
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">Kaise Kaam Karta Hai</h2>
          <p className="mt-2 text-muted-foreground">Sirf 3 simple steps</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center">Professional Templates</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Apne business type ke hisaab se template chunein
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {sampleTemplates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                onSelect={(template) => setPreviewTemplate(template)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <Card
            className="w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video bg-muted">
              <img
                src={previewTemplate.thumbnail}
                alt={previewTemplate.name}
                className="size-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/800x450/e2e8f0/64748b?text=${encodeURIComponent(previewTemplate.name)}`
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold">{previewTemplate.name}</h3>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                {previewTemplate.category}
              </p>
              <p className="mt-2 text-sm">{previewTemplate.description}</p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/register"
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                >
                  Is Template ke Saath Shuru Karein
                </Link>
                <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold">Sab Kuch Shamil Hai</h2>
          <p className="mt-2 text-muted-foreground">
            Ek professional website ke liye zaroori sab kuch
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center">Simple Pricing</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Koi hidden charges nahi
          </p>
          <div className="mt-12 mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
            <Card className="p-6 flex flex-col">
              <h3 className="text-2xl font-bold">Free</h3>
              <p className="mt-1 text-sm text-muted-foreground">Startup ke liye perfect</p>
              <p className="mt-4 text-4xl font-bold">
                ₹0<span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {["1 Website", "bizsite.app subdomain", "WhatsApp integration", "Mobile friendly"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-green-600" /> {item}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/register"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Free Mein Shuru Karein
              </Link>
            </Card>
            <Card className="p-6 flex flex-col border-primary">
              <h3 className="text-2xl font-bold">Pro</h3>
              <p className="mt-1 text-sm text-muted-foreground">Growing business ke liye</p>
              <p className="mt-4 text-4xl font-bold">
                ₹199<span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
              <ul className="mt-6 space-y-3 flex-1">
                {["Custom domain", "Analytics", "Remove branding", "Priority support", "Unlimited pages"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-green-600" /> {item}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/register"
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Pro Plan Chunein
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
