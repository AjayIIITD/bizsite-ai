export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { businessId } = await params

  const business = await prisma.business.findUnique({ where: { id: businessId } })
  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (business.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "30d"

  const now = new Date()
  let startDate: Date | null = null
  if (period === "7d") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (period === "30d") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  const where = {
    businessId,
    ...(startDate ? { createdAt: { gte: startDate } } : {}),
  }

  const events = await prisma.analyticsEvent.findMany({ where, orderBy: { createdAt: "asc" } })

  const uniqueVisitors = new Set(
    events
      .filter((e: { metadata: unknown }) => e.metadata && typeof e.metadata === "object" && "visitorId" in (e.metadata as Record<string, unknown>))
      .map((e: { metadata: unknown }) => {
        const m = e.metadata as Record<string, unknown> | null
        return m?.visitorId as string
      })
      .filter(Boolean)
  ).size

  const eventsByType: Record<string, number> = {}
  for (const e of events) {
    eventsByType[e.event] = (eventsByType[e.event] || 0) + 1
  }

  const dailyMap = new Map<string, number>()
  for (const e of events) {
    const dateKey = e.createdAt.toISOString().split("T")[0]
    dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1)
  }

  const dailyBreakdown = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return NextResponse.json({
    totalViews: events.length,
    uniqueVisitors,
    eventsByType,
    dailyBreakdown,
  })
}
