import { SECTION_MAP, WhatsAppButton } from "@/components/sections"
import { TrackView } from "./track-view"

interface PublishedSite {
  sections: any[]
  styles: any
  businessName: string
  phone: string | null
  slug: string
}

async function getSiteData(slug: string): Promise<PublishedSite | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/site/${slug}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function SitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getSiteData(slug)

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-lg text-muted-foreground">Website not found</p>
        <p className="text-sm text-muted-foreground">The site you are looking for does not exist or has not been published yet.</p>
      </div>
    )
  }

  const { sections, styles, phone } = data

  const sectionStyles = styles?.colors
    ? styles
    : { colors: { primary: styles?.primaryColor || "#000000", secondary: styles?.secondaryColor || "#666666", accent: styles?.backgroundColor || "#ffffff" } }

  return (
    <>
      <TrackView slug={slug} />
      <main className="min-h-screen" style={{ fontFamily: styles?.fontFamily || "Inter" }}>
        {sections.map((section: any) => {
          const Component = SECTION_MAP[section.type as keyof typeof SECTION_MAP]
          if (!Component) return null
          return <Component key={section.id} content={section.content} styles={sectionStyles} slug={slug} />
        })}
      </main>
      <WhatsAppButton phone={phone || ""} />
    </>
  )
}
