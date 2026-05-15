export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { applyTemplateSchema } from "@/lib/validations"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const business = await prisma.business.findFirst({ where: { OR: [{ id }, { slug: id }] } })
  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (business.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const parsed = applyTemplateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const template = await prisma.template.findUnique({
    where: { id: parsed.data.template_id },
  })

  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 })
  }

  await prisma.website.update({
    where: { businessId: business.id },
    data: {
      sections: template.sections as any,
      styles: template.styles as any,
      lastEditedAt: new Date(),
    },
  })

  return NextResponse.json({ success: true })
}
