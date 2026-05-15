export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const business = await prisma.business.findUnique({
      where: { id },
      include: { website: true },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: business.id,
      name: business.name,
      description: business.description,
      phone: business.phone,
      slug: business.slug,
      siteStatus: business.siteStatus,
      website: business.website
        ? {
            sections: business.website.sections,
            styles: business.website.styles,
            publishedVersion: business.website.publishedVersion,
          }
        : null,
    })
  } catch (error) {
    console.error("Error fetching website:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const business = await prisma.business.findUnique({ where: { id }, select: { userId: true } })
    if (!business || business.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { sections, styles } = body

    const existing = await prisma.website.findUnique({
      where: { businessId: id },
    })

    if (existing) {
      await prisma.website.update({
        where: { businessId: id },
        data: { sections, styles, lastEditedAt: new Date() },
      })
    } else {
      await prisma.website.create({
        data: { businessId: id, sections, styles },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving website:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
