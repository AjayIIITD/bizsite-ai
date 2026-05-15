"use client"

import { useState } from "react"
import { Phone, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactSectionProps {
  content: {
    heading?: string
    email?: string
    phone?: string
    showForm?: boolean
  }
  styles?: {
    colors?: { primary?: string; secondary?: string; accent?: string }
    typography?: any
  }
  slug?: string
}

export default function ContactSection({ content, slug }: ContactSectionProps) {
  const { heading = "Contact Us", email, phone, showForm = true } = content
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug) return
    setSubmitting(true)
    try {
      await fetch(`/api/contact/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
      setForm({ name: "", email: "", phone: "", message: "" })
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h2>
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
          <div className="space-y-6">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-5 w-5" />
                <span>{phone}</span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-5 w-5" />
                <span>{email}</span>
              </a>
            )}
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
              <Input
                type="tel"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <Textarea
                placeholder="Message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
              <Button type="submit" disabled={submitting} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Sending..." : submitted ? "Sent!" : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
