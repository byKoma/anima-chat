// Chat Export API
import { NextResponse } from "next/server"
import { exportChat } from "@/lib/chat-storage"

// Export chat
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("id")
    const format = searchParams.get("format") || "txt"

    if (!chatId) {
      return NextResponse.json({ error: "Chat-ID fehlt" }, { status: 400 })
    }

    const content = exportChat(chatId, format as "txt" | "md" | "json")
    if (!content) {
      return NextResponse.json({ error: "Chat nicht gefunden" }, { status: 404 })
    }

    const filename = `chat_${chatId}_${new Date().toISOString().split("T")[0]}.${format}`

    return new Response(content, {
      headers: {
        "Content-Type": format === "md" ? "text/markdown" : format === "json" ? "application/json" : "text/plain",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Export Fehler:", error)
    return NextResponse.json({ error: "Chat kann nicht exportiert werden" }, { status: 500 })
  }
}
