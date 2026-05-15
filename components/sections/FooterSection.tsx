import { Globe, Link as LinkIcon } from "lucide-react"

interface FooterSectionProps {
  content: {
    copyright?: string
    socialLinks?: Array<{ platform: string; url: string }>
  }
  styles?: {
    colors?: { primary?: string; secondary?: string; accent?: string }
    typography?: any
  }
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  website: <Globe className="h-5 w-5" />,
  link: <LinkIcon className="h-5 w-5" />,
}

export default function FooterSection({ content }: FooterSectionProps) {
  const { copyright = "© 2024 BizSite. All rights reserved.", socialLinks = [] } = content

  return (
    <footer className="bg-foreground px-6 py-12 text-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <p className="text-sm opacity-80">{copyright}</p>
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 transition-opacity hover:opacity-100"
                aria-label={link.platform}
              >
                {SOCIAL_ICONS[link.platform.toLowerCase()] || <Globe className="h-5 w-5" />}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
