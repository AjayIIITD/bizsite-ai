export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: { website: true },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    if (!business.website) {
      return NextResponse.json({ error: "No website data to publish" }, { status: 400 })
    }

    await prisma.business.update({
      where: { id },
      data: {
        siteStatus: "PUBLISHED",
        publishedAt: new Date(),
      },
    })

    await prisma.website.update({
      where: { businessId: id },
      data: {
        publishedVersion: {
          sections: business.website.sections,
          styles: business.website.styles,
        },
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`
    const liveUrl = `${baseUrl}/${business.slug}`

    return NextResponse.json({
      success: true,
      url: liveUrl,
      message: "Website published successfully",
    })
  } catch (error) {
    console.error("Publish error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
