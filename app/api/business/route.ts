export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { businessSchema } from "@/lib/validations"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = businessSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, category, description, tagline, phone, email, address, logo, city } = parsed.data

  let slug = generateSlug(name)
  const existing = await prisma.business.findUnique({ where: { slug } })
  if (existing) {
    const suffix = Math.random().toString(36).substring(2, 6)
    slug = `${slug}-${suffix}`
  }

  const business = await prisma.$transaction(async (tx: any) => {
    const biz = await tx.business.create({
      data: {
        name,
        slug,
        category,
        description,
        tagline,
        phone,
        email,
        address: city ? `${address || ""}, ${city}` : address,
        logo,
        userId: session.user!.id!,
        website: {
          create: {
            sections: [],
            styles: {},
          },
        },
      },
      include: { website: true },
    })

    const template = await tx.template.findFirst({
      where: { category },
      orderBy: { popular: "desc" },
    })

    if (template) {
      await tx.website.update({
        where: { businessId: biz.id },
        data: {
          sections: template.sections as Record<string, unknown>[],
          styles: template.styles as Record<string, unknown>,
        },
      })
    }

    return biz
  })

  const result = await prisma.business.findUnique({
    where: { id: business.id },
    include: { website: true },
  })

  return NextResponse.json(result, { status: 201 })
}
