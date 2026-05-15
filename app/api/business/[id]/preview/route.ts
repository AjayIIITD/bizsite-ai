export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const business = await prisma.business.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { website: true },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    const sections = (business.website?.sections as any[]) ?? []
    const styles = (business.website?.styles as Record<string, string>) ?? {}

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${business.name} - Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; }
    ${styles.primaryColor ? `:root { --primary: ${styles.primaryColor}; }` : ""}
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    window.__PREVIEW_DATA__ = ${JSON.stringify({ sections, styles, businessName: business.name, phone: business.phone, slug: business.slug })}
  </script>
</body>
</html>`

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  } catch (error) {
    console.error("Preview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
