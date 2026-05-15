export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params

  const body = await request.json()
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const business = await prisma.business.findUnique({ where: { slug: businessId } })
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 })
  }

  const { name, email, phone, message } = parsed.data

  await prisma.contact.create({
    data: {
      name,
      email,
      phone: phone || null,
      message,
      businessId: business.id,
    },
  })

  return NextResponse.json({ success: true })
}

export async function GET(
  _request: Request,
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

  const contacts = await prisma.contact.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(contacts)
}
