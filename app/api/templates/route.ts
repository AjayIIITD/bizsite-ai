export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  const where = category ? { category } : {}

  const templates = await prisma.template.findMany({
    where,
    orderBy: { name: "asc" },
  })

  return NextResponse.json(templates)
}
