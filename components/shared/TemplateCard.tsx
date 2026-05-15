"use client"

import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Template {
  id: string
  name: string
  category: string
  thumbnail: string
  description: string
}

interface TemplateCardProps {
  template: Template
  selected?: boolean
  onSelect?: (template: Template) => void
}

export default function TemplateCard({
  template,
  selected,
  onSelect,
}: TemplateCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer overflow-hidden transition-all hover:shadow-md",
        selected ? "ring-2 ring-primary" : ""
      )}
      onClick={() => onSelect?.(template)}
    >
      <div className="aspect-video bg-muted">
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="size-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(template.name)}`
            }}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
            {template.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{template.name}</h3>
          {selected && <Check className="size-4 text-primary" />}
        </div>
        {template.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{template.description}</p>
        )}
        <span className="mt-2 inline-block text-xs text-muted-foreground capitalize">{template.category}</span>
      </div>
    </Card>
  )
}
