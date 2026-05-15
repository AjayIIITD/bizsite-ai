import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getOpenAI } from "@/lib/ai"
import { generateContentSchema } from "@/lib/validations"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = generateContentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { businessName, category, services } = parsed.data

  try {
    const prompt = `Generate business content for a "${businessName}" in the "${category}" industry.
Return JSON with: tagline (short and catchy), aboutText (2-3 sentences about the business)${services ? `, services as an array of objects with name and description${services.length > 0 ? ` for these services: ${services.join(", ")}` : ""}` : ", services as an array of 4 objects with name and description"}.
Only return valid JSON.`

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })

    const content = JSON.parse(completion.choices[0]?.message?.content || "{}")

    return NextResponse.json({
      tagline: content.tagline || "",
      aboutText: content.aboutText || "",
      services: content.services || [],
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
