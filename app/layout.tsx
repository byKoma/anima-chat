import type React from "react"
// Root layout component
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Anima - Open Source AI Chat",
  description: "Fully open-source LLM chat application with support for OpenAI, OpenRouter and Ollama",
  keywords: ["AI", "Chat", "LLM", "OpenAI", "OpenRouter", "Ollama", "Open Source"],
  authors: [{ name: "Anima Team" }],
  generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}