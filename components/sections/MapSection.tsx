import { MapPin } from "lucide-react"

interface MapSectionProps {
  content: {
    address?: string
    embedUrl?: string
  }
  styles?: {
    colors?: { primary?: string; secondary?: string; accent?: string }
    typography?: any
  }
}

export default function MapSection({ content }: MapSectionProps) {
  const { address, embedUrl } = content

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {embedUrl ? (
          <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
            <iframe
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location"
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
            <p className="text-muted-foreground">No map configured</p>
          </div>
        )}
        {address && (
          <div className="mt-6 flex items-center justify-center gap-2 text-center">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <span>{address}</span>
          </div>
        )}
        {address && (
          <div className="mt-4 text-center">
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
