export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { site_id, event } = body

    if (!site_id || !event) {
      return NextResponse.json({ error: "site_id and event are required" }, { status: 400 })
    }

    const business = await prisma.business.findUnique({
      where: { slug: site_id },
      select: { id: true },
    })

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    await prisma.analyticsEvent.create({
      data: {
        event,
        businessId: business.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics track error:", error)
    return NextResponse.json({ success: false })
  }
}
