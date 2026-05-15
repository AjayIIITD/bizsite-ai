"use client"

import { useEffect, useState } from "react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { PageLoader, ButtonSpinner } from "@/components/shared/LoadingStates"
import { AlertTriangle, Upload } from "lucide-react"

interface Business {
  id: string
  name: string
  category: string
  phone: string
  whatsapp: string
  city: string
  address: string
  logo: string | null
  customDomain: string | null
  slug: string
}

const categories = [
  "restaurant",
  "salon",
  "shop",
  "service",
  "fitness",
  "other",
]

export default function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState("")

  // Form fields
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [customDomain, setCustomDomain] = useState("")
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/business/mine")
        if (res.ok) {
          const data = await res.json()
          setBusiness(data)
          setName(data.name || "")
          setCategory(data.category || "")
          setPhone(data.phone || "")
          setWhatsapp(data.whatsapp || "")
          setCity(data.city || "")
          setAddress(data.address || "")
          setCustomDomain(data.customDomain || "")
          setLogo(data.logo || null)
        }
      } catch {
        // not found
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!business) return
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch(`/api/business/${business.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          phone,
          whatsapp,
          city,
          address,
          customDomain,
          logo,
        }),
      })
      if (!res.ok) throw new Error("Failed to save")
      setMessage("Settings saved successfully!")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!business) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/business/${business.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      window.location.href = "/"
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  function handleLogoUpload() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const formData = new FormData()
      formData.append("file", file)
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (res.ok) {
          const data = await res.json()
          setLogo(data.url)
        }
      } catch {
        // upload failed
      }
    }
    input.click()
  }

  if (loading) return <PageLoader />

  if (!business) {
    return (
      <Card className="p-12 text-center text-muted-foreground">
        No business found. Create one first.
      </Card>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your business profile</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Business Details</h2>

          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Business"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
              <Label>WhatsApp</Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123, Main Street"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Branding</h2>

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              {logo && (
                <img
                  src={logo}
                  alt="Logo"
                  className="size-16 rounded-lg border object-cover"
                />
              )}
              <Button type="button" variant="outline" onClick={handleLogoUpload}>
                <Upload className="size-4" />
                {logo ? "Change Logo" : "Upload Logo"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold">Domain</h2>
          <div className="space-y-2">
            <Label>Custom Domain</Label>
            <Input
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="yourbusiness.com"
            />
            <p className="text-xs text-muted-foreground">
              Your free subdomain:{" "}
              <span className="font-mono">{business.slug}.bizsite.app</span>
            </p>
          </div>
        </Card>

        {message && (
          <p
            className={`text-sm ${
              message.includes("success") ? "text-green-600" : "text-destructive"
            }`}
          >
            {message}
          </p>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? <ButtonSpinner /> : null}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Once deleted, your website and all data will be permanently removed.
            </p>
            <Button
              variant="destructive"
              className="mt-4"
              onClick={() => setDeleteOpen(true)}
            >
              Delete Business
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={(open) => setDeleteOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Business</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{business.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <ButtonSpinner /> : null}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
