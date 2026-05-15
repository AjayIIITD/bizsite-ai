"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { create } from "zustand"
import {
  GripVertical,
  Plus,
  Eye,
  Save,
  Upload,
  Sparkles,
  Palette,
  Undo2,
  Redo2,
  Globe,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SECTION_MAP,
  createSection,
  createDefaultSections,
  DEFAULT_STYLES,
} from "@/components/sections"
import { SectionSkeleton } from "@/components/sections/skeleton"
import { generateContent, suggestColors, generateServices } from "@/lib/ai"
import type { Section, SectionType, StyleConfig } from "@/types"

interface HistoryEntry {
  sections: Section[]
  styles: StyleConfig
}

interface EditorStore {
  sections: Section[]
  styles: StyleConfig
  selectedSectionId: string | null
  history: HistoryEntry[]
  historyIndex: number
  isDirty: boolean
  lastSaved: Date | null
  isPreviewMode: boolean

  setSections: (sections: Section[]) => void
  setStyles: (styles: StyleConfig) => void
  setSelectedSectionId: (id: string | null) => void
  setIsPreviewMode: (v: boolean) => void
  setLastSaved: (d: Date | null) => void
  setIsDirty: (v: boolean) => void

  pushHistory: (sections: Section[], styles: StyleConfig) => void
  undo: () => void
  redo: () => void

  updateSection: (id: string, content: any) => void
  addSection: (type: SectionType) => void
  removeSection: (id: string) => void
  reorderSection: (fromIdx: number, toIdx: number) => void
  selectSection: (id: string | null) => void
}

const useEditorStore = create<EditorStore>((set, get) => ({
  sections: [],
  styles: { ...DEFAULT_STYLES },
  selectedSectionId: null,
  history: [],
  historyIndex: -1,
  isDirty: false,
  lastSaved: null,
  isPreviewMode: false,

  setSections: (sections) => set({ sections }),
  setStyles: (styles) => set({ styles }),
  setSelectedSectionId: (id) => set({ selectedSectionId: id }),
  setIsPreviewMode: (v) => set({ isPreviewMode: v }),
  setLastSaved: (d) => set({ lastSaved: d }),
  setIsDirty: (v) => set({ isDirty: v }),

  pushHistory: (sections, styles) => {
    const { history, historyIndex } = get()
    const entry: HistoryEntry = { sections: JSON.parse(JSON.stringify(sections)), styles: JSON.parse(JSON.stringify(styles)) }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(entry)
    if (newHistory.length > 50) newHistory.shift()
    set({ history: newHistory, historyIndex: newHistory.length - 1 })
  },

  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex <= 0) return
    const newIdx = historyIndex - 1
    const entry = history[newIdx]
    set({
      sections: JSON.parse(JSON.stringify(entry.sections)),
      styles: JSON.parse(JSON.stringify(entry.styles)),
      historyIndex: newIdx,
      isDirty: true,
    })
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex >= history.length - 1) return
    const newIdx = historyIndex + 1
    const entry = history[newIdx]
    set({
      sections: JSON.parse(JSON.stringify(entry.sections)),
      styles: JSON.parse(JSON.stringify(entry.styles)),
      historyIndex: newIdx,
      isDirty: true,
    })
  },

  updateSection: (id, content) => {
    const { sections, styles } = get()
    const newSections = sections.map((s) => (s.id === id ? { ...s, content } : s))
    set({ sections: newSections, isDirty: true })
    get().pushHistory(newSections, styles)
  },

  addSection: (type) => {
    const { sections, styles } = get()
    const section = createSection(type)
    const newSections = [...sections, section]
    set({ sections: newSections, selectedSectionId: section.id, isDirty: true })
    get().pushHistory(newSections, styles)
  },

  removeSection: (id) => {
    const { sections, styles, selectedSectionId } = get()
    const newSections = sections.filter((s) => s.id !== id)
    set({
      sections: newSections,
      selectedSectionId: selectedSectionId === id ? null : selectedSectionId,
      isDirty: true,
    })
    get().pushHistory(newSections, styles)
  },

  reorderSection: (fromIdx, toIdx) => {
    const { sections, styles } = get()
    if (fromIdx === toIdx) return
    const newSections = [...sections]
    const [moved] = newSections.splice(fromIdx, 1)
    newSections.splice(toIdx, 0, moved)
    const reindexed = newSections.map((s, i) => ({ ...s, order: i + 1 }))
    set({ sections: reindexed, isDirty: true })
    get().pushHistory(reindexed, styles)
  },

  selectSection: (id) => set({ selectedSectionId: id }),
}))

const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  HERO: "Hero",
  ABOUT: "About",
  SERVICES: "Services",
  GALLERY: "Gallery",
  CONTACT: "Contact",
  TESTIMONIALS: "Testimonials",
  MAP: "Map",
  FOOTER: "Footer",
}

const ALL_SECTION_TYPES = Object.keys(SECTION_TYPE_LABELS) as SectionType[]

function AddSectionDialog({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (type: SectionType) => void }) {
  const [selected, setSelected] = useState<SectionType>("HERO")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Section</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {ALL_SECTION_TYPES.map((type) => (
            <button
              key={type}
              className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${selected === type ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
              onClick={() => setSelected(type)}
            >
              {SECTION_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
        <Button className="mt-4 w-full" onClick={() => { onAdd(selected); onClose() }}>
          Add {SECTION_TYPE_LABELS[selected]}
        </Button>
      </Card>
    </div>
  )
}

function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function HeroEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Heading</label>
        <Input value={content.heading || ""} onChange={(e) => onChange({ ...content, heading: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Subheading</label>
        <Input value={content.subheading || ""} onChange={(e) => onChange({ ...content, subheading: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">CTA Text</label>
        <Input value={content.ctaText || ""} onChange={(e) => onChange({ ...content, ctaText: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">CTA Link</label>
        <Input value={content.ctaLink || ""} onChange={(e) => onChange({ ...content, ctaLink: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Layout</label>
        <Select value={content.layout || "center"} onValueChange={(v) => onChange({ ...content, layout: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Background Image</label>
        <div className="flex gap-2">
          <Input value={content.backgroundImage || ""} onChange={(e) => onChange({ ...content, backgroundImage: e.target.value })} placeholder="Image URL" />
          <Button variant="outline" size="icon" onClick={() => { const url = prompt("Paste image URL:"); if (url) onChange({ ...content, backgroundImage: url }) }}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function AboutEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Heading</label>
        <Input value={content.heading || ""} onChange={(e) => onChange({ ...content, heading: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Text</label>
        <Textarea value={content.text || ""} onChange={(e) => onChange({ ...content, text: e.target.value })} rows={5} />
      </div>
      <div>
        <label className="text-sm font-medium">Image</label>
        <div className="flex gap-2">
          <Input value={content.image || ""} onChange={(e) => onChange({ ...content, image: e.target.value })} placeholder="Image URL" />
          <Button variant="outline" size="icon" onClick={() => { const url = prompt("Paste image URL:"); if (url) onChange({ ...content, image: url }) }}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ServicesEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const items = content.items || []

  const addItem = () => {
    onChange({ ...content, items: [...items, { id: generateId(), name: "", description: "", price: "", image: "" }] })
  }

  const removeItem = (id: string) => {
    onChange({ ...content, items: items.filter((i: any) => i.id !== id) })
  }

  const updateItem = (id: string, field: string, value: string) => {
    onChange({ ...content, items: items.map((i: any) => (i.id === id ? { ...i, [field]: value } : i)) })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Heading</label>
        <Input value={content.heading || ""} onChange={(e) => onChange({ ...content, heading: e.target.value })} />
      </div>
      {items.map((item: any, index: number) => (
        <div key={item.id} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Item {index + 1}</span>
            <Button variant="ghost" size="icon-xs" onClick={() => removeItem(item.id)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Input placeholder="Name" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
          <Textarea placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} rows={2} />
          <Input placeholder="Price" value={item.price} onChange={(e) => updateItem(item.id, "price", e.target.value)} />
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={addItem}>
        <Plus className="mr-1 h-3 w-3" /> Add Service
      </Button>
    </div>
  )
}

function GalleryEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const images = content.images || []

  const addImage = () => {
    const url = prompt("Paste image URL:")
    if (url) {
      onChange({ ...content, images: [...images, { id: generateId(), url, alt: "" }] })
    }
  }

  const removeImage = (id: string) => {
    onChange({ ...content, images: images.filter((i: any) => i.id !== id) })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Heading</label>
        <Input value={content.heading || ""} onChange={(e) => onChange({ ...content, heading: e.target.value })} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img: any) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border">
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            <button
              className="absolute right-1 top-1 hidden rounded-full bg-black/60 p-1 text-white group-hover:block"
              onClick={() => removeImage(img.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="w-full" onClick={addImage}>
        <Plus className="mr-1 h-3 w-3" /> Add Image
      </Button>
    </div>
  )
}

function ContactEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Heading</label>
        <Input value={content.heading || ""} onChange={(e) => onChange({ ...content, heading: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input value={content.email || ""} onChange={(e) => onChange({ ...content, email: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium">Phone</label>
        <Input value={content.phone || ""} onChange={(e) => onChange({ ...content, phone: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={content.showForm !== false}
          onChange={(e) => onChange({ ...content, showForm: e.target.checked })}
          className="h-4 w-4"
        />
        Show contact form
      </label>
    </div>
  )
}

function TestimonialsEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const items = content.items || []

  const addItem = () => {
    onChange({ ...content, items: [...items, { id: generateId(), name: "", text: "", image: "" }] })
  }

  const removeItem = (id: string) => {
    onChange({ ...content, items: items.filter((i: any) => i.id !== id) })
  }

  const updateItem = (id: string, field: string, value: string) => {
    onChange({ ...content, items: items.map((i: any) => (i.id === id ? { ...i, [field]: value } : i)) })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Heading</label>
        <Input value={content.heading || ""} onChange={(e) => onChange({ ...content, heading: e.target.value })} />
      </div>
      {items.map((item: any, index: number) => (
        <div key={item.id} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Item {index + 1}</span>
            <Button variant="ghost" size="icon-xs" onClick={() => removeItem(item.id)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <Input placeholder="Name" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} />
          <Textarea placeholder="Testimonial text" value={item.text} onChange={(e) => updateItem(item.id, "text", e.target.value)} rows={3} />
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={addItem}>
        <Plus className="mr-1 h-3 w-3" /> Add Testimonial
      </Button>
    </div>
  )
}

function MapEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Address</label>
        <Textarea value={content.address || ""} onChange={(e) => onChange({ ...content, address: e.target.value })} rows={3} />
      </div>
    </div>
  )
}

function FooterEditor({ content, onChange }: { content: any; onChange: (c: any) => void }) {
  const links = content.socialLinks || []

  const addLink = () => {
    onChange({ ...content, socialLinks: [...links, { platform: "", url: "" }] })
  }

  const removeLink = (i: number) => {
    onChange({ ...content, socialLinks: links.filter((_: any, idx: number) => idx !== i) })
  }

  const updateLink = (i: number, field: string, value: string) => {
    onChange({ ...content, socialLinks: links.map((l: any, idx: number) => (idx === i ? { ...l, [field]: value } : l)) })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Copyright</label>
        <Input value={content.copyright || ""} onChange={(e) => onChange({ ...content, copyright: e.target.value })} />
      </div>
      {links.map((link: any, i: number) => (
        <div key={i} className="flex items-start gap-2 rounded-lg border p-3">
          <div className="flex-1 space-y-2">
            <Input placeholder="Platform (e.g. Instagram)" value={link.platform} onChange={(e) => updateLink(i, "platform", e.target.value)} />
            <Input placeholder="URL" value={link.url} onChange={(e) => updateLink(i, "url", e.target.value)} />
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeLink(i)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full" onClick={addLink}>
        <Plus className="mr-1 h-3 w-3" /> Add Social Link
      </Button>
    </div>
  )
}

type EditorComponent = React.ComponentType<{ content: any; onChange: (c: any) => void }>

function getSectionEditor(type: SectionType): EditorComponent {
  switch (type) {
    case "HERO": return HeroEditor
    case "ABOUT": return AboutEditor
    case "SERVICES": return ServicesEditor
    case "GALLERY": return GalleryEditor
    case "CONTACT": return ContactEditor
    case "TESTIMONIALS": return TestimonialsEditor
    case "MAP": return MapEditor
    case "FOOTER": return FooterEditor
  }
}

function StyleEditor({ styles, onChange }: { styles: StyleConfig; onChange: (s: StyleConfig) => void }) {
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Site Styles</h3>
      <div>
        <label className="text-sm font-medium">Primary Color</label>
        <div className="flex gap-2">
          <Input value={styles.primaryColor} onChange={(e) => onChange({ ...styles, primaryColor: e.target.value })} />
          <input type="color" value={styles.primaryColor} onChange={(e) => onChange({ ...styles, primaryColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded border" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Secondary Color</label>
        <div className="flex gap-2">
          <Input value={styles.secondaryColor} onChange={(e) => onChange({ ...styles, secondaryColor: e.target.value })} />
          <input type="color" value={styles.secondaryColor} onChange={(e) => onChange({ ...styles, secondaryColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded border" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Background Color</label>
        <div className="flex gap-2">
          <Input value={styles.backgroundColor} onChange={(e) => onChange({ ...styles, backgroundColor: e.target.value })} />
          <input type="color" value={styles.backgroundColor} onChange={(e) => onChange({ ...styles, backgroundColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded border" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Text Color</label>
        <div className="flex gap-2">
          <Input value={styles.textColor} onChange={(e) => onChange({ ...styles, textColor: e.target.value })} />
          <input type="color" value={styles.textColor} onChange={(e) => onChange({ ...styles, textColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded border" />
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={async () => {
          try {
            const res = await suggestColors("My Business", "")
            if (res.colors) {
              onChange({ ...styles, ...res.colors })
            }
          } catch {
            // silently fail
          }
        }}
      >
        <Palette className="mr-1 h-4 w-4" /> Suggest Colors
      </Button>
    </div>
  )
}

export default function EditorPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [businessName, setBusinessName] = useState("")
  const [aiGenerating, setAiGenerating] = useState(false)
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const store = useEditorStore()
  const {
    sections,
    styles,
    selectedSectionId,
    history,
    historyIndex,
    isDirty,
    lastSaved,
    isPreviewMode,
    setSections,
    setStyles,
    setSelectedSectionId,
    setIsPreviewMode,
    setLastSaved,
    setIsDirty,
    undo,
    redo,
    updateSection,
    addSection,
    removeSection,
    reorderSection,
  } = store

  const selectedSection = sections.find((s) => s.id === selectedSectionId) ?? null

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/business/${params.id}/website`)
        if (!res.ok) throw new Error("Failed to load")
        const data = await res.json()
        setBusinessName(data.name || "")
        if (data.website) {
          const loadedSections = (data.website.sections as any[]) ?? []
          const loadedStyles = (data.website.styles as StyleConfig) ?? DEFAULT_STYLES
          setSections(loadedSections)
          setStyles(loadedStyles)
          if (loadedSections.length > 0) {
            setSelectedSectionId(loadedSections[0].id)
          }
        } else {
          const defaults = createDefaultSections()
          setSections(defaults)
          if (defaults.length > 0) {
            setSelectedSectionId(defaults[0].id)
          }
        }
      } catch {
        const defaults = createDefaultSections()
        setSections(defaults)
        if (defaults.length > 0) {
          setSelectedSectionId(defaults[0].id)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  useEffect(() => {
    if (!isDirty) return
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current)
    autoSaveTimer.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/business/${params.id}/website`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections, styles }),
        })
        if (res.ok) {
          setIsDirty(false)
          setLastSaved(new Date())
        }
      } catch {
        // silently fail
      }
    }, 30000)
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current)
    }
  }, [isDirty, sections, styles, params.id])

  const handleSave = useCallback(async () => {
    try {
      const res = await fetch(`/api/business/${params.id}/website`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, styles }),
      })
      if (res.ok) {
        setIsDirty(false)
        setLastSaved(new Date())
      }
    } catch {
      // silently fail
    }
  }, [sections, styles, params.id])

  const handlePublish = useCallback(async () => {
    setPublishing(true)
    try {
      await handleSave()
      const res = await fetch(`/api/business/${params.id}/publish`, { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setPublishDialogOpen(false)
        alert(`Website published!\n\nView live: ${data.url}`)
      } else {
        alert(data.error || "Failed to publish")
      }
    } catch {
      alert("Failed to publish")
    } finally {
      setPublishing(false)
    }
  }, [params.id, handleSave])

  const handleGenerateContent = useCallback(async () => {
    setAiGenerating(true)
    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, description: "" }),
      })
      const data = await res.json()
      if (data.content) {
        const heroSection = sections.find((s) => s.type === "HERO")
        const aboutSection = sections.find((s) => s.type === "ABOUT")
        if (heroSection && data.content.hero) {
          updateSection(heroSection.id, { ...heroSection.content, ...data.content.hero })
        }
        if (aboutSection && data.content.about) {
          updateSection(aboutSection.id, { ...aboutSection.content, ...data.content.about })
        }
      }
    } catch {
      // silently fail
    } finally {
      setAiGenerating(false)
    }
  }, [businessName, sections, updateSection])

  const handleGenerateServices = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/generate-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, description: "" }),
      })
      const data = await res.json()
      const servicesSection = sections.find((s) => s.type === "SERVICES")
      if (servicesSection && data.items) {
        updateSection(servicesSection.id, { ...servicesSection.content, items: data.items })
      }
    } catch {
      // silently fail
    }
  }, [businessName, sections, updateSection])

  const handleDragStart = (index: number) => {
    dragItem.current = index
  }

  const handleDragOver = (index: number) => {
    dragOverItem.current = index
  }

  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return
    reorderSection(dragItem.current, dragOverItem.current)
    dragItem.current = null
    dragOverItem.current = null
  }

  const openPreview = () => {
    window.open(`/api/business/${params.id}/preview`, "_blank")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">BizSite Editor</span>
          <span className="text-xs text-muted-foreground">{businessName}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={historyIndex <= 0}
            onClick={undo}
            title="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={historyIndex >= history.length - 1}
            onClick={redo}
            title="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-5 w-px bg-border" />
          <span className={`text-xs ${isDirty ? "text-amber-500" : "text-green-500"}`}>
            {isDirty ? "Unsaved changes" : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "No changes"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openPreview}>
            <Eye className="mr-1 h-4 w-4" /> Preview
          </Button>
          <Button variant="default" size="sm" onClick={() => setPublishDialogOpen(true)}>
            <Globe className="mr-1 h-4 w-4" /> Publish
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Sections List */}
        <aside className="flex w-60 shrink-0 flex-col border-r bg-muted/20">
          <div className="flex items-center justify-between border-b px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections</span>
            <Button variant="ghost" size="icon-xs" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {sections.length === 0 && (
              <p className="p-4 text-center text-xs text-muted-foreground">No sections yet. Click + to add one.</p>
            )}
            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => { e.preventDefault(); handleDragOver(index) }}
                onDrop={handleDrop}
                className={`mb-1 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${selectedSectionId === section.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                onClick={() => setSelectedSectionId(section.id)}
              >
                <div className="cursor-grab text-muted-foreground" onMouseDown={(e) => e.stopPropagation()}>
                  <GripVertical className="h-3.5 w-3.5" />
                </div>
                <span className="flex-1 truncate">{section.type.charAt(0) + section.type.slice(1).toLowerCase()}</span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => { e.stopPropagation(); removeSection(section.id) }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Panel - Canvas */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {isPreviewMode ? (
            <iframe src={`/api/business/${params.id}/preview`} className="h-full w-full border-0" title="Preview" />
          ) : (
            <div className="flex-1 overflow-y-auto bg-zinc-100 p-8">
              <div className="mx-auto max-w-4xl rounded-xl bg-white shadow-sm">
                {sections.length === 0 ? (
                  <div className="flex h-64 items-center justify-center">
                    <p className="text-muted-foreground">Add sections to start building your site.</p>
                  </div>
                ) : (
                  sections.map((section) => {
                    const Component = SECTION_MAP[section.type]
                    if (!Component) return null
                    const isSelected = selectedSectionId === section.id
                    return (
                      <div
                        key={section.id}
                        className={`relative cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:ring-1 hover:ring-muted-foreground/30"}`}
                        onClick={() => setSelectedSectionId(section.id)}
                      >
                        <Component content={section.content} styles={{ colors: { primary: styles.primaryColor, secondary: styles.secondaryColor, accent: styles.backgroundColor } }} />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Properties */}
        <aside className="flex w-80 shrink-0 flex-col border-l bg-background">
          <div className="flex items-center border-b px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {selectedSection ? `${selectedSection.type.charAt(0) + selectedSection.type.slice(1).toLowerCase()} Properties` : "Properties"}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {selectedSection ? (
              <div className="space-y-4 p-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={handleGenerateContent}
                    disabled={aiGenerating}
                  >
                    <Sparkles className="mr-1 h-3 w-3" /> Generate Content
                  </Button>
                  {selectedSection.type === "SERVICES" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={handleGenerateServices}
                    >
                      <Sparkles className="mr-1 h-3 w-3" /> Generate Services
                    </Button>
                  )}
                </div>
                {(() => {
                  const Editor = getSectionEditor(selectedSection.type)
                  return (
                    <Editor
                      content={selectedSection.content}
                      onChange={(content) => updateSection(selectedSection.id, content)}
                    />
                  )
                })()}
              </div>
            ) : (
              <>
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Select a section to edit
                </div>
                <StyleEditor styles={styles} onChange={(s) => { setStyles(s); setIsDirty(true) }} />
              </>
            )}
          </div>
        </aside>
      </div>

      {/* Add Section Dialog */}
      <AddSectionDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={(type) => addSection(type)}
      />

      {/* Publish Dialog */}
      {publishDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-sm p-6">
            <h3 className="mb-2 text-lg font-semibold">Publish your website?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              This will make your website live at your custom URL. Are you sure?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setPublishDialogOpen(false)} disabled={publishing}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={publishing}>
                {publishing ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
