import { Card, CardContent } from "@/components/ui/card"

interface ServicesSectionProps {
  content: {
    heading?: string
    items?: Array<{
      name?: string
      description?: string
      price?: string
      image?: string
    }>
  }
  styles?: {
    colors?: { primary?: string; secondary?: string; accent?: string }
    typography?: any
  }
}

export default function ServicesSection({ content, styles }: ServicesSectionProps) {
  const { heading = "Our Services", items = [] } = content
  const accentColor = styles?.colors?.accent

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Card key={i} className="group overflow-hidden transition-shadow hover:shadow-lg">
              {item.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name || ""}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="relative p-6">
                {item.price && (
                  <span
                    className="absolute -top-3 right-4 rounded-full px-3 py-1 text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor || "hsl(var(--accent))" }}
                  >
                    {item.price}
                  </span>
                )}
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
