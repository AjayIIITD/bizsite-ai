"use client"

import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phone: string
  message?: string
}

export default function WhatsAppButton({ phone, message = "Hello!" }: WhatsAppButtonProps) {
  const text = encodeURIComponent(message)
  const href = `https://wa.me/${phone}?text=${text}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:animate-none"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
