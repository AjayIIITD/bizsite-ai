import OpenAI from "openai"

let _openai: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    })
  }
  return _openai
}

export async function generateContent(businessName: string, description: string) {
  const res = await fetch("/api/ai/generate-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businessName, description }),
  })
  if (!res.ok) throw new Error("Failed to generate content")
  return res.json()
}

export async function suggestColors(category: string, preference?: string) {
  const res = await fetch("/api/ai/suggest-colors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, preference }),
  })
  if (!res.ok) throw new Error("Failed to suggest colors")
  return res.json()
}

export async function generateServices(businessName: string, description: string) {
  const res = await fetch("/api/ai/generate-services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ businessName, description }),
  })
  if (!res.ok) throw new Error("Failed to generate services")
  return res.json()
}
