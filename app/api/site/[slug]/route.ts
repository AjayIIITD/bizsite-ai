export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const business = await prisma.business.findUnique({
      where: { slug },
      include: { website: true },
    })

    if (!business || business.siteStatus !== "PUBLISHED" || !business.website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 })
    }

    const version = business.website.publishedVersion as any
    const sections = version?.sections ?? business.website.sections
    const styles = version?.styles ?? business.website.styles

    return NextResponse.json({
      sections,
      styles,
      businessName: business.name,
      phone: business.phone,
      slug: business.slug,
    })
  } catch (error) {
    console.error("Error fetching site:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
