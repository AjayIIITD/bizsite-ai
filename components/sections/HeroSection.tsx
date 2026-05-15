import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  content: {
    heading?: string
    subheading?: string
    ctaText?: string
    ctaLink?: string
    backgroundImage?: string
    layout?: "left" | "center"
  }
  styles?: {
    colors?: { primary?: string; secondary?: string; accent?: string }
    typography?: any
  }
}

export default function HeroSection({ content }: HeroSectionProps) {
  const {
    heading = "Welcome to BizSite",
    subheading = "Build your online presence in minutes",
    ctaText = "Get Started",
    ctaLink = "#",
    backgroundImage,
    layout = "center",
  } = content

  if (layout === "left") {
    return (
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        {backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        <div
          className={
            "absolute inset-0 " +
            (backgroundImage
              ? "bg-gradient-to-r from-background/95 via-background/80 to-background/60"
              : "")
          }
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 md:flex-row">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              {heading}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              {subheading}
            </p>
            <Link href={ctaLink}>
              <Button size="lg" className="mt-8">
                {ctaText}
              </Button>
            </Link>
          </div>
          {backgroundImage && (
            <div className="flex-1">
              <img
                src={backgroundImage}
                alt={heading}
                className="rounded-xl shadow-2xl"
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="relative flex items-center justify-center overflow-hidden px-6 py-24 text-center md:py-40">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div
        className={
          "absolute inset-0 " +
          (backgroundImage
            ? "bg-gradient-to-t from-black/80 via-black/50 to-black/30"
            : "")
        }
      />
      <div className="relative max-w-4xl">
        <h1
          className="text-4xl font-bold tracking-tight md:text-6xl"
          style={{ color: backgroundImage ? "#fff" : undefined }}
        >
          {heading}
        </h1>
        <p
          className="mx-auto mt-4 max-w-2xl text-lg md:text-xl"
          style={{ color: backgroundImage ? "rgba(255,255,255,0.8)" : undefined }}
        >
          {subheading}
        </p>
        <Link href={ctaLink}>
          <Button size="lg" className="mt-8">
            {ctaText}
          </Button>
        </Link>
      </div>
    </section>
  )
}
