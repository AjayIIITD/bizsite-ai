import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getOpenAI } from "@/lib/ai"
import { suggestColorsSchema } from "@/lib/validations"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = suggestColorsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { category, preference } = parsed.data

  try {
    const prompt = `Suggest a color palette for a "${category}" business website.${preference ? ` Preference: ${preference}.` : ""}
Return JSON with exactly: primary (main brand color), secondary, accent — all as hex codes.
Only return valid JSON.`

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    })

    const content = JSON.parse(completion.choices[0]?.message?.content || "{}")

    return NextResponse.json({
      primary: content.primary || "#000000",
      secondary: content.secondary || "#666666",
      accent: content.accent || "#ffffff",
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to suggest colors" },
      { status: 500 }
    )
  }
}
