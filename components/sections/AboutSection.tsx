interface AboutSectionProps {
  content: {
    heading?: string
    text?: string
    image?: string
  }
  styles?: {
    colors?: { primary?: string; secondary?: string; accent?: string }
    typography?: any
  }
}

export default function AboutSection({ content }: AboutSectionProps) {
  const { heading = "About Us", text, image } = content

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        {image && (
          <div className="order-2 md:order-1">
            <img
              src={image}
              alt={heading}
              className="w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        )}
        <div className={image ? "order-1 md:order-2" : "mx-auto max-w-3xl text-center"}>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h2>
          {text && (
            <p className="mt-4 text-muted-foreground leading-relaxed">{text}</p>
          )}
        </div>
      </div>
    </section>
  )
}
