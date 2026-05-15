export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { businessUpdateSchema } from "@/lib/validations"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const business = await prisma.business.findUnique({
    where: { id },
    include: { website: true },
  })

  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(business)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const business = await prisma.business.findUnique({ where: { id } })
  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (business.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const parsed = businessUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updated = await prisma.business.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const business = await prisma.business.findUnique({ where: { id } })
  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (business.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.business.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
