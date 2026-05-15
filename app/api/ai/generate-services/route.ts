import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getOpenAI } from "@/lib/ai"
import { generateServicesSchema } from "@/lib/validations"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = generateServicesSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { businessName, category } = parsed.data

  try {
    const prompt = `Generate 4-6 service offerings for "${businessName}", a "${category}" business.
Return JSON with an array called "services" containing objects with: name, description, and optional price.
Only return valid JSON.`

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })

    const content = JSON.parse(completion.choices[0]?.message?.content || "{}")

    return NextResponse.json(content.services || [])
  } catch {
    return NextResponse.json(
      { error: "Failed to generate services" },
      { status: 500 }
    )
  }
}
