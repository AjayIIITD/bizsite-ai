export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const business = await prisma.business.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { website: true },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    if (business.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!business.website) {
      return NextResponse.json({ error: "No website data to publish" }, { status: 400 })
    }

    await prisma.business.update({
      where: { id: business.id },
      data: {
        siteStatus: "PUBLISHED",
        publishedAt: new Date(),
      },
    })

    await prisma.website.update({
      where: { businessId: business.id },
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
