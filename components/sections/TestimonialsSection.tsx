"use client"

import { useEffect, useState, useCallback } from "react"
import { Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TestimonialsSectionProps {
  content: {
    heading?: string
    items?: Array<{
      name?: string
      text?: string
      image?: string
    }>
  }
  styles?: {
    colors?: { primary?: string; secondary?: string; accent?: string }
    typography?: any
  }
}

export default function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const { heading = "Testimonials", items = [] } = content
  const [active, setActive] = useState(0)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    if (items.length < 2) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [items.length, next])

  if (!items.length) return null

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h2>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {items.map((item, i) => (
              <div key={i} className="min-w-0 shrink-0 basis-full px-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <Quote className="mb-4 h-8 w-8 text-muted-foreground/40" />
                    <p className="flex-1 text-muted-foreground">&ldquo;{item.text}&rdquo;</p>
                    <div className="mt-4 flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 w-2 rounded-full transition-all ${
                i === active ? "w-6 bg-primary" : "bg-muted-foreground/30"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
